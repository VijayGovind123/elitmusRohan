require("dotenv").config();


const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TOKEN_ID;
const bot = new TelegramBot(token, { polling: true });



const orders = {};

const formatItemDetails = (item) => {
  return `${item.name} - Price: ${item.price}$, Quantity: ${item.quantity}, Weight: ${item.weight}, Type: ${item.type}, Brand: ${item.brand}`;
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome to Rohan Bot! Here are the available commands:
    /inventory -It displays all the items available in our store
    /order - It helps in placing the order`
  );
});

// handle /inventory command
bot.onText(/\/inventory/, (msg) => {
  const chatId = msg.chat.id;
  const inventory = [
    {
      name: "Soap",
      price: 10,
      quantity: 5,
      weight: "100g",
      type: "Type 1",
      brand: "Brand 1",
    },
    {
      name: "Bucket",
      price: 20,
      quantity: 3,
      weight: "200g",
      type: "Type 2",
      brand: "Brand 2",
    },
    {
      name: "Pen",
      price: 30,
      quantity: 2,
      weight: "300g",
      type: "Type 3",
      brand: "Brand 3",
    },
    {
      name: "NoteBook",
      price: 40,
      quantity: 1,
      weight: "400g",
      type: "Type 4",
      brand: "Brand 4",
    },
    {
      name: "Dish washer",
      price: 50,
      quantity: 10,
      weight: "500g",
      type: "Type 5",
      brand: "Brand 5",
    },
    {
      name: "Maggi",
      price: 60,
      quantity: 8,
      weight: "600g",
      type: "Type 6",
      brand: "Brand 6",
    },
    {
      name: "Bottle",
      price: 70,
      quantity: 6,
      weight: "700g",
      type: "Type 7",
      brand: "Brand 7",
    },
    {
      name: "Keychain",
      price: 80,
      quantity: 4,
      weight: "800g",
      type: "Type 8",
      brand: "Brand 8",
    },
    {
      name: "Spray",
      price: 90,
      quantity: 7,
      weight: "900g",
      type: "Type 9",
      brand: "Brand 9",
    },
    {
      name: "Shampoo",
      price: 100,
      quantity: 9,
      weight: "1kg",
      type: "Type 10",
      brand: "Brand 10",
    },
  ];


  let message = "Here are the available items in our store:\n\n";
  inventory.forEach((item) => {
    message += `${item.name} - ${item.price} Rs - Remaining quantity: ${item.quantity}\n`;
    
  });

  bot.sendMessage(chatId, message);
});
var customerId = "";
bot.onText(/\/order/, (msg) => {
  const chatId = msg.chat.id;
  customerId = chatId;
  let message =
    "Please select the item(s) you would like to order from the inventory:\n\n";
  const inventory = [
    {
      name: "Soap",
      price: 10,
      quantity: 5,
      weight: "100g",
      type: "Type 1",
      brand: "Brand 1",
    },
    {
      name: "Bucket",
      price: 20,
      quantity: 3,
      weight: "200g",
      type: "Type 2",
      brand: "Brand 2",
    },
    {
      name: "Pen",
      price: 30,
      quantity: 2,
      weight: "300g",
      type: "Type 3",
      brand: "Brand 3",
    },
    {
      name: "NoteBook",
      price: 40,
      quantity: 1,
      weight: "400g",
      type: "Type 4",
      brand: "Brand 4",
    },
    {
      name: "Dish washer",
      price: 50,
      quantity: 10,
      weight: "500g",
      type: "Type 5",
      brand: "Brand 5",
    },
    {
      name: "Maggi",
      price: 60,
      quantity: 8,
      weight: "600g",
      type: "Type 6",
      brand: "Brand 6",
    },
    {
      name: "Bottle",
      price: 70,
      quantity: 6,
      weight: "700g",
      type: "Type 7",
      brand: "Brand 7",
    },
    {
      name: "Keychain",
      price: 80,
      quantity: 4,
      weight: "800g",
      type: "Type 8",
      brand: "Brand 8",
    },
    {
      name: "Spray",
      price: 90,
      quantity: 7,
      weight: "900g",
      type: "Type 9",
      brand: "Brand 9",
    },
    {
      name: "Shampoo",
      price: 100,
      quantity: 9,
      weight: "1kg",
      type: "Type 10",
      brand: "Brand 10",
    },
  ];

  // create a keyboard with the available items
  const keyboard = [];
  inventory.forEach((item) => {
    if (item.quantity > 0) {
      keyboard.push([
        {
          text: `${item.name} - ${item.price} Rs`,
          callback_data: `${item.name},${item.price}`,
        },
      ]);
    }
  });

  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  };

  bot.sendMessage(chatId, message, options);
});

bot.on("callback_query", function (msg) {
    var currentThread = "";
    var data = msg.data;
    const chatId = msg.message.chat.id;
    currentThread = data;
    if (data === "order confirmed") {
      // Process order confirmation logic
      bot.sendMessage(customerId, "Your order has been confirmed. Thank you!");
      bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: msg.message.message_id});
    } else if (data === "order cancelled") {
      // Process order cancellation logic
      bot.sendMessage(customerId, "Your order has been cancelled.");
      bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: msg.message.message_id});
    } else if (currentThread !== "") {
      // split array at comma
      const [itemName, itemPrice] = currentThread.split(",");
      const orderSummary = `${"@" + msg.message.chat.username} has ordered for ${itemName} a total cost of Rs ${itemPrice}. Do you want to proceed with the order?`;
  
      bot.sendMessage(process.env.CUSTOMER_ID, orderSummary, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Yes",
                callback_data: `order confirmed`,
              },
              {
                text: "No",
                callback_data: "order cancelled",
              },
            ],
          ]
        },
      });
      bot.editMessageReplyMarkup({inline_keyboard: []}, {chat_id: chatId, message_id: msg.message.message_id});
      bot.pollingError = (err) => console.log(err);
    }
  });
