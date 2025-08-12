import { CommentStream, SubmissionStream } from "snoostorm"
import { getCloseMatches } from "difflib"
import Snoowrap from "snoowrap"
import cheerio from "cheerio"
import path from "path"
import fs from "fs"

//////////////////////////////////////////////////////////////////////////////////////

globalThis.getCloseMatches = getCloseMatches
globalThis.cheerio = cheerio

//////////////////////////////////////////////////////////////////////////////////////

globalThis.config = JSON.parse(fs.readFileSync("./json/config.json", "utf-8"))

//////////////////////////////////////////////////////////////////////////////////////

globalThis.client = new Snoowrap(config.login)

client.commands = new Map()

//////////////////////////////////////////////////////////////////////////////////////

for await (const f of getFiles("./commands")) {
  const command = (await import("./" + path.relative("./", f).replace(/\\/g, "/"))).default
  command.name = path.basename(f, ".js")
  if (!command.aliases) command.aliases = []
  if (!command.help.arguments) command.help.arguments = ""
  client.commands.set(command.name, command)
}

//////////////////////////////////////////////////////////////////////////////////////

globalThis.argTypes = {
  command(item, comment) {
    item = item.toLowerCase()
    return client.commands.get(item) ?? Array.from(client.commands).find(e => e[1].aliases.includes(item))?.[1]
  }
}

//////////////////////////////////////////////////////////////////////////////////////

async function* getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, {withFileTypes: true})
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name)
    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

async function runCommand(command, comment, args) {
  try {
    if (command.arguments) for (const [i, arg] of command.arguments.entries()) {
      const argSplit = arg.split(":")
      if (!arg.includes("?") && !args[i]){
        return sendError(comment, {
          title: "Missing required argument",
          description: `Please include: \`${argSplit[0].replace(/\?|\*/g, "")}\``
        })
      }
      let stop = false
      if (arg.includes("*")) {
        stop = true
        if(args[i]) args = [].concat(args.slice(0, i), args.slice(i, args.length).join(" "))
      }
      const argument = args[i]
      if (~arg.indexOf(":") && argument){
        args[i] = await argTypes[argSplit[1]](argument, {comment})
        if (args[i] === false) return
        else if (args[i] === undefined) return sendError(comment, {
          title: `Invalid argument type for \`${argSplit[0].replace(/\?|\*/g, "")}\``,
          description: `\`${argument.substring(0, 128)}\` is not a valid \`${argSplit[1]}\``
        })
      }
      if (stop) break
    }
    await command.execute(comment, args)
  } catch (e) {
    console.error(e)
  }
}

function makeMessage(message) {
  let str = ""
  if (message.title) str += `**${message.title}**\n\n`
  if (message.description) str += `${message.description}\n\n`
  if (message.fields) for (const field of message.fields) str += `* **${field[0]}**\n   * ${field[1]}\n\n`
  return `${str}\n\n^(Beep boop i am a bot)`
}

globalThis.sendReply = (comment, message) => {
  comment.reply(makeMessage(message))
}

globalThis.sendError = (comment, error) => {
  if (error.title) error.title = `Error: ${error.title}`
  else error.title = "Error"
  comment.reply(makeMessage(error))
}

//////////////////////////////////////////////////////////////////////////////////////

const comments = new CommentStream(client, {
  subreddit: "optifine",
  limit: 1
})

comments.on("item", async comment => {
  if (comment.author.name === client.username) return
  if (config.prefixes.includes(comment.body[0])) {
    comment = await comment.expandReplies({ limit: Infinity, depth: 1 })
    if (!comment.replies.find(e => e.author.name === client.username)) {
      const commentParts = comment.body.split(/(?<! ) /)
      const commandName = commentParts[0].substring(1).toLowerCase()
      const command = client.commands.get(commandName) ?? Array.from(client.commands).find(e => e[1].aliases.includes(commandName))?.[1]
      if (!command) return
      commentParts.shift()
      runCommand(command, comment, commentParts)
    }
  }
})

const posts = new SubmissionStream(client, {
  subreddit: "optifine",
  limit: 1
})

posts.on("item", async post => {
  if (post.link_flair_text === "Help") {
    post = await post.expandReplies({ limit: Infinity, depth: 1 })
    if (!post.comments.find(e => e.author.name === client.username)) {
      sendReply(post, {
        title: "Not getting the help you were looking for?",
        description: "Join the [OptiFine Discord server](https://discord.gg/3mMpcwW) for faster support.\n\nUsing a pre-release? Check if the issue also occurs on the previous major full release — if not, it may be a pre-release bug.\n\n_Commenters: Please respect Rule 8._"
      })
    }
  }
})

//////////////////////////////////////////////////////////////////////////////////////

process.on("unhandledRejection", async e => console.error(e))

console.log("Client online")