/**
 * Maintained by Sandon.
 */
Function.prototype.myBind = function() {
  const self = this // 保存原函数
  const context = Array.prototype.shift.call(arguments) // 保存需要绑定的this上下文
  // 上一行等价于 context = [].shift.call(arguments)
  const args = Array.prototype.slice.call(arguments) // 剩余的参数转为数组
  return function() { // 返回一个新函数
    self.apply(context, args.concat(Array.prototype.slice.call(arguments)))
  }
}
