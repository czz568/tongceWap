//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.
 

//提供 $.Deferred promises API. 依赖"callbacks" 模块.
(function ($) {
    var slice = Array.prototype.slice;

    function Deferred(func) {
        var tuples = [
                // 状态切换方法名、对应状态执行方法名、函数回调列表、最终状态
                ["resolve", "done", $.Callbacks({once: 1, memory: 1}), "resolved"],
                ["reject", "fail", $.Callbacks({once: 1, memory: 1}), "rejected"],
                ["notify", "progress", $.Callbacks({memory: 1})]
            ],
            //Promise的初始状态
            state = "pending",
            /**
             * promise只包含执行阶段的方法always(),then(),done(),fail(),progress()及辅助方法state()、promise()等。
             * deferred则在继承promise的基础上，增加切换状态的方法，resolve()/resolveWith(),reject()/rejectWith(),notify()/notifyWith()
             * 所以称promise是deferred的只读副本
             * */
            promise = {
                // 返回promise状态
                state: function () {
                    return state
                },
                //成功/失败均回调调用
                always: function () {
                    deferred.done(arguments).fail(arguments);
                    return this
                },
                then: function (/* fnDone [, fnFailed [, fnProgress]] */) {
                    var fns = arguments;
                    //生成新的deferred，即defer；并为旧deferred添加新的回调函数；返回新的promise对象，then方法后的回调会被添加到新的回调函数列表中
                    return Deferred(function (defer) {
                        $.each(tuples, function (i, tuple) {
                            //i==0:fnDone；i==1:fnFailed；i==2:fnProgress
                            var fn = $.isFunction(fns[i]) && fns[i];
                            //为旧deferred的done/fail/progress方法添加回调函数，回调函数不会立即执行
                            deferred[tuple[1]](function () {
                                //旧deferred状态切换方法名触发时，调用相应的then函数参数
                                var returned = fn && fn.apply(this, arguments);
                                /**
                                 * 如果then的函数参数调用返回了值，而且值存在promise方法，那么执行promise方法，
                                 * 并将defer的resolve/reject/notify添加到promise的done/fail/progress中，
                                 * 如果返回的继承promise的对象状态被切换，那么defer的相应状态切换方法同时被调用
                                 * */
                                if (returned && $.isFunction(returned.promise)) {
                                    returned.promise()
                                        .done(defer.resolve)
                                        .fail(defer.reject)
                                        .progress(defer.notify)
                                } else {
                                    /**
                                     * 如果then方法有返回值，则新defer的所有回调函数都使用该值作为参数，否则使用旧deferred回调参数
                                     * 在非严格模式下，this为null或undefined时为被自动替换成全局对象window
                                     * */
                                    var context = this === promise ? defer.promise() : this,
                                        values = fn ? [returned] : arguments;
                                    defer[tuple[0] + "With"](context, values)
                                }
                            })
                        });
                        fns = null
                    }).promise()
                },
                //如果存在obj，则将promise对象的方法赋值给obj；否则返回promise对象
                promise: function (obj) {
                    return obj != null ? $.extend(obj, promise) : promise
                }
            },
            deferred = {};
        //给deferred添加切换状态方法
        $.each(tuples, function (i, tuple) {
            var list = tuple[2], //回调函数列表
                stateString = tuple[3];  //promise最终状态
            //扩展promise的done、fail、progress为Callback的add方法，使其成为回调列表，使用的时候.done(func) func就添加到了回调函数中
            promise[tuple[1]] = list.add;
            /**
             * 切换的状态是resolve成功/reject失败；添加首组方法做预处理，修改state的值，使成功或失败互斥；
             * disable后就算上次触发了add时还是不会立即执行，memory被设置为undefined
             * 锁定progress回调列表，锁定后progress回调列表不能再被触发
             * */
            if (stateString) {
                list.add(function () {
                    state = stateString;
                    //i^1  ^异或运算符  0^1=1 1^1=0，成功或失败回调互斥，调用一方，禁用另一方
                }, tuples[i ^ 1][2].disable, tuples[2][2].lock)
            }
            //添加切换状态方法 resolve()/resolveWith(),reject()/rejectWith(),notify()/notifyWith()
            deferred[tuple[0]] = function () {
                deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                return this
            };
            deferred[tuple[0] + "With"] = list.fireWith
        });
        //deferred包装成promise 继承promise对象的方法
        promise.promise(deferred);
        //传递了参数func，执行
        if (func) func.call(deferred, deferred);
        //返回deferred对象
        return deferred
    }

    //主要用于多异步队列处理：多异步队列都成功，执行成功方法，一个失败，执行失败方法。也可以传非异步队列对象
    $.when = function (sub) {
        var resolveValues = slice.call(arguments),
            //队列个数
            len = resolveValues.length,
            i = 0,
            //子deferred计数
            remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
            //主def，如果是1个fn，直接以它为主def，否则建立新的Def
            deferred = remain === 1 ? sub : Deferred(),
            progressValues, progressContexts, resolveContexts,
            updateFn = function (i, ctx, val) {
                return function (value) {
                    ctx[i] = this;
                    val[i] = arguments.length > 1 ? slice.call(arguments) : value;
                    if (val === progressValues) {
                        //如果是通知，调用主函数的通知，通知可以调用多次
                        deferred.notifyWith(ctx, val)
                    } else if (!(--remain)) {
                        //如果是成功，则需等成功计数为0，即所有子def都成功执行了，remain变为0，再调用主函数的成功
                        deferred.resolveWith(ctx, val)
                    }
                }
            };

        //如果参数列表长度大于一，那么校验是否为promise对象，如果不是则将remain减一
        if (len > 1) {
            progressValues = new Array(len);
            progressContexts = new Array(len);
            resolveContexts = new Array(len);
            for (; i < len; ++i) {
                if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
                    resolveValues[i].promise()
                        .done(updateFn(i, resolveContexts, resolveValues))
                        .fail(deferred.reject) //直接挂入主def的失败通知函数,当某个子def失败时，调用主def的切换失败状态方法，执行主def的失败函数列表
                        .progress(updateFn(i, progressContexts, progressValues))
                } else {
                    //非def，直接标记成功，减1
                    --remain
                }
            }
        }
        //比如无参数，或者所有子队列全为非def，直接切换到成功状态，后面就算返回了promise对象，添加的回调函数也不会被触发
        if (!remain) deferred.resolveWith(resolveContexts, resolveValues);
        return deferred.promise()
    };

    $.Deferred = Deferred
})(Zepto);
