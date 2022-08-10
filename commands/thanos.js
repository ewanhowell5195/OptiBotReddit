export default {
  help: {
    description: "Provides a quick guide to find incompatible Minecraft mods."
  },
  aliases: ["thanosmethod", "tm", "tmtm", "snap", "split", "binarysplit", "binary", "method"],
  execute(comment) {
    sendReply(comment, {
      title: "The Thanos Method!™️",
      fields: [
        ["What the heck is it?", "*The Thanos Method!™* (more accurately known as a binary split) is a debugging technique used to find mods that are incompatible with OptiFine."],
        ["Before testing:", "Please make sure OptiFine works on its own before trying to add other mods."],
        ["How does it work?", "*The Thanos Method!™* is simple. To find conflicting mods, split your mods folder into 2 groups. Remove one group, and test in-game. Keep the group that has the problem, and repeat until no more mods can be removed without the issue disappearing. Thanks to *The Thanos Method!™*, you can now report the incompatible mods on GitHub!\n\n^(*The Thanos Method!™* is not actually trademarked or even remotely considered an official name. Please don't sue us, we just thought it was funny)"]
      ]
    })
  }
}