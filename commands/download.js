export default {
  help: {
    description: "Provides various links to download OptiFine."
  },
  aliases: ["site", "optisite", "website", "optifine", "dl"],
  async execute(comment) {
    const fields = [["Backup website", "https://optifined.net/downloads"]]
    try {
      const site = cheerio.load(await fetch("https://optifine.net/downloads").then(e => e.text()))
      const version = site(".downloadLine:first")
      const name = version.find(".colFile").text().replace("OptiFine", `OptiFine ${site("h2:first").text().split(" ")[1]}`)
      const url = "https://optifine.net/" + cheerio.load(await fetch(version.find(".colMirror").children().attr("href")).then(e => e.text()))(".downloadButton").children().attr("href")
      fields.push(["Latest release", `[${name}](${url})`])
    } catch {}
    fields.push(["Older versions (B1.4 - 1.9)", "[Ridiculously long URL](https://www.minecraftforum.net/forums/mapping-and-modding-java-edition/minecraft-mods/1286605-b1-4-1-9-optifine-history)"])
    sendReply(comment, {
      title: "Download OptiFine",
      description: "https://optifine.net/downloads",
      fields
    })
  }
}