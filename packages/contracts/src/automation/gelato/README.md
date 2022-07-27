# Gelato interface library

Gelato not provide with proper library for interacting with his contracts and implementing communication interfaces.
But it provide example [Ops repo](https://github.com/gelatodigital/ops), which contain part of interfaces and base classes.

They can be used by forge as gitmodules library, but they not compatible with OpenZeppelin upgradable contracts.
We rewrited them in a way that support upgradable contracts.