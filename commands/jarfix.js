export default {
  help: {
    description: "Provides a link to download Jarfix."
  },
  aliases: ["jar", "jarfix"],
  async execute(comment, args) {
    sendReply(comment, {
      title: "Download Jarfix",
      description: "https://johann.loefflmann.net/downloads/jarfix.exe\n\nJarfix is a program that fixes how Windows runs `.jar` files. It will relink them to open with Java, allowing you to install OptiFine.\n\nTo use Jarfix, download and run the program from the link above. The file associations will be fixed automatically.",
      fields: [["For more information", "https://johann.loefflmann.net/jarfix"]]
    })
  }
}