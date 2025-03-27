<template>
  <div class="flex flex-col gap-6 items-center">
    <blockquote class="text-2xl font-bold text-center text-white">
      <slot></slot>
    </blockquote>
    <cite class="text-xl font-medium text-center text-zinc-300">
      <slot name="author"></slot>
    </cite>
  </div>
</template>
