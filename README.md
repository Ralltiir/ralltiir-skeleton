# Ralltiir Skeleton
![Language](https://img.shields.io/badge/-TypeScript-blue.svg)
[![Build Status](https://travis-ci.org/Ralltiir/ralltiir-skeleton.svg?branch=master)](https://travis-ci.org/Ralltiir/ralltiir-skeleton)
[![Coveralls](https://img.shields.io/coveralls/Ralltiir/ralltiir-skeleton.svg)](https://coveralls.io/github/Ralltiir/ralltiir-skeleton)
[![npm package](https://img.shields.io/npm/v/ralltiir-skeleton.svg)](https://www.npmjs.org/package/ralltiir-skeleton)
[![npm downloads](http://img.shields.io/npm/dm/ralltiir-skeleton.svg)](https://www.npmjs.org/package/ralltiir-skeleton)

# What's ralltiir-skeleton
骨架屏（skeleton）的作用主要是在网络请求较慢时，提供基础占位，当数据加载完成，恢复数据展示。这样给用户一种很自然的过渡，不会造成页面长时间白屏或者闪烁等情况。

ralltiir-skeleton主要向整页或基于ralltiir实现的页面提供渲染骨架屏的机制，ralltiir-skeleton包含skeleton基类及skeleton内部实现的接口appearance。

- **skeleton**
  - 实现生命周期，提供钩子方法
  - 提供各种[可选参数](https://ralltiir.github.io/ralltiir-skeleton/interfaces/tabskeletonoption.html)，以满足skeleton实现各种效果，如渐显隐、容器fixed（以实现动画）、内部元素偏移（以实现居中）
  - 调用实现appearance接口的组件渲染/销毁内部样貌

- **appearance**
  - 在skeleton容器内实现渲染的接口，其会接口方法被skeleton在生命周期合适的时机调用

- [API](https://ralltiir.github.io/ralltiir-skeleton/)

# Usage

```javascript

var appearance = new LoadingAppearance({toplight: true});

var skeleton = new Skeleton.Skeleton(container, appearance, {
  background: "#FFF"
  ,fadeOut: true
  ,fadeOutDuration: 400
  ,isOffset: true
  ,isFixed: true
});

skeleton.create();
skeleton.destroy();

```

# Appearance Component

目前已经提供2类Appearance组件：

- [ralltiir-skeleton-loading](https://github.com/Ralltiir/ralltiir-skeleton-loading)
  - 主要实现居中效果的loading态
  - [Demo](https://ralltiir.github.io/ralltiir-skeleton-loading/demo/)
- [ralltiir-skeleton-tombstone](https://github.com/Ralltiir/ralltiir-skeleton-tombstone)
  - 主要实现骨架屏效果
  - [Demo](https://ralltiir.github.io/ralltiir-skeleton-tombstone/demo/)

# 在ralltiir页面中使用ralltiir-skeleton

- 方式一：在ralltiir view的生命周期方法里直接创建/销毁ralltiir-skeleton
- 方式二：（开发中）通过注册方式提前声明ralltiir service对应的ralltiir-skeleton效果
