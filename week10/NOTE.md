# 学习笔记
本周学习了使用LL算法构建AST，首先是使用Generator函数将一个表达式拆分为token的集合，之后使用MultiplicativeExpression、AdditiveExpression、Expression三个方法对生成的集合进行乘除法的处理、加减法的处理、EOF的处理，最后得到了四则运算的AST，其中Generator函数的运用，以及队列的使用都是很值得学习的。
