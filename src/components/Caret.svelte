<style>
  .caret-empty {
    animation: empty 1s step-end infinite;
    color: transparent;
  }

  .caret-full {
    animation: full 1s step-end infinite;
    color: #fff;
  }

  @keyframes empty {
    50% {
      background-color: #fff;
    }
  }

  @keyframes full {
    50% {
      background-color: #fff;
      color: #000;
    }
  }
</style>

<script lang="ts">
  export let precaret: string
  export let caret: string
  export let caretActive: boolean
  export let postcaret: string
</script>

<span
  >{precaret}<span class={caretActive ? 'caret-full' : 'caret-empty'}>{caret}</span
  >{postcaret}</span
>
