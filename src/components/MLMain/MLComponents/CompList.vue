<template>
  <tree-view :model="model"
             :category="category"
             :selection="selection"
             :onSelect="onSelect"
             :display="display"
             :search="search"
             :strategies="strategies"
             :transition="transition"
             :dragndrop="dragndrop"
             :css="css">
  </tree-view>
</template>

<script>
  import {TreeView} from "@bosket/vue"
  import {string} from "@bosket/tools"
  import {dragndrop} from "@bosket/core"
  import model from "./CompModel"
  import css from "./CompList.css"

  export default {
    data: function () {
      return {
        selection: [],
        // Data model
        model: model,
        // Property of the model containing children
        category: "items",
        // On selection, update the parent selection array
        onSelect: function(_) {},
        // Custom display (with an anchor tag)
        display: item => item.label,
        // Search by regex
        search: input => i => string(i.label).contains(input),
        strategies: {
          // Select on click
          click: ["select", "toggle-fold"],
          // Use keyboard modifiers
          selection: ["modifiers"],
          // Use the opener to control element folding
          fold: ["opener-control"]
        },
        css: css,
        // Transitions
        transition: {
          attrs: {appear: true},
          props: {name: "TreeViewTransition"}
        },
        dragndrop: {
          drag: (item, event) => {
            event.dataTransfer.setData("desc",item.desc);
            event.dataTransfer.setData("label",item.label);
            event.dataTransfer.setData("type",item.type);
          },
          draggable: item => !item.items,
          droppable: false
        }
      }
    },
    methods: {},
    components: {
      "tree-view": TreeView
    }
  }
</script>

<style>
  @import "CompList.css";
</style>
