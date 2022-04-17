const { Telegraf } = require('telegraf')
require('dotenv').config()

const getInvoice = (id) => {
  const invoice = {
    chat_id: id, // Unique identifier of the target chat or username of the target channel
    provider_token: process.env.PROVIDER_TOKEN, // token issued via bot @PaymentBot
    start_parameter: 'get_access', // Unique parameter for deep links. If you leave this field blank, forwarded copies of the forwarded message will have a Pay button that allows multiple users to pay directly from the forwarded message using the same account. If not empty, redirected copies of the sent message will have a URL button with a deep link to the bot (instead of a payment button) with a value used as an initial parameter.
    title: 'Футболка белая', // Product name, 1-32 characters
    description: 'Ваша белая потрясающая футболка', // Product description, 1-255 characters
    currency: 'UAH', // ISO 4217 Three-Letter Currency Code
    photo_url: 'https://images.izi.ua/56530430',
    prices: [
      { label: 'Свитер', amount: 100 * 100 },
      { label: 'Футболка', amount: 100 * 100 }], // Price breakdown, serialized list of components in JSON format 100 kopecks * 100 = 100 rubles
    payload: { // The payload of the invoice, as determined by the bot, 1-128 bytes. This will not be visible to the user, use it for your internal processes.
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN
    }
  }

  return invoice
}


const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.help((ctx) => {
  bot.telegram.sendMessage(
    ctx.message.chat.id,
    '<b>Вы заказали</b>\n\n<i>Cвитер</i> - <b>100 грн</b>\n<i>Футболка</i> - <b>100 грн</b>\n\nВсего: <b>200 грн</b>',
    {parse_mode: 'HTML'},
  )
  return ctx.replyWithInvoice(getInvoice(ctx.message.chat.id))
})


bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
  .then(() => console.log('Bot started'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
