export default {
  help: {
    description: "View a frequently asked question.",
    arguments: "[faq]",
    example: "install"
  },
  aliases: ["faqs"],
  arguments: ["?*faq"],
  async execute(comment, args) {
    try {
      const faqs = await fetch("https://raw.githubusercontent.com/ewanhowell5195/OptiBotReddit/main/json/faq.json").then(e => e.json())
      const questions = faqs.map(e => e.question).sort()
      if (!args[0]) return sendReply(comment, {
        title: "Available FAQs",
        description: `* ${questions.join("\n* ")}\n\nUse \`${config.prefixes[0]}faq [question]\` to view a specific FAQ`
      })
      const question = getCloseMatches(args[0], questions, 1, 0)[0]
      const faq = faqs.find(e => e.question === question)
      sendReply(comment, {
        title: question,
        description: `${faq.answer}\n\nTo see a full list of FAQs, use the command \`${config.prefixes[0]}faq\``
      })
    } catch (err) {
      sendError(comment, {
        title: "Unable to fetch FAQ data",
        description: "Please try again later"
      })
    }
  }
}