export default {
  help: {
    description: "Shows a notice about using pre-releases."
  },
  aliases: ["pre", "preview"],
  execute(comment) {
    sendReply(comment, {
      title: "Notice Regarding OptiFine Pre-releases",
      description: "If you are using a pre-release version of OptiFine, that is a version which is still in development. Bugs are expected and are a normal part of the pre-release process.\n\nIf you encounter a bug, please check the [OptiFine issue tracker](https://github.com/sp614x/optifine/issues) to see if it has already been reported. If not, report it there.\n\nThere is likely no fix until a future pre-release or the full release. If you prefer a stable experience, we recommend waiting for the final version. Please be patient as development continues."
    })
  }
}