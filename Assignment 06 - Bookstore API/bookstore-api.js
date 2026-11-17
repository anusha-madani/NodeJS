const SystemEvents = require("events");
const appEmitter = new SystemEvents();
const urlEncoder = require("querystring");
const webServer = require("express");
const myApp = webServer();

const libraryBooks = require("./data/books");
const registeredCustomers = require("./data/customers");
const storeOrders = require("./data/orders");

const welcomeForm = `
<h1>Bookstore Management</h1>
<h3>Quick Book Search</h3>
<form action="/api/books" method="get">
  <p><input name="name" placeholder="Enter book title"></p>
  <p><input name="author" placeholder="Author name"></p>
  <p><input name="genre" placeholder="Book category"></p>
  <button type="submit">Find Books</button>
</form>`;

appEmitter.on("searchLogged", (logData) => {
    console.log(`[LOG] Search performed -> Query: ${urlEncoder.stringify(logData.queryCriteria)} | Matches: ${logData.totalFound}`);
});

myApp.get("/", (req, res) => {
    res.send(welcomeForm);
});

myApp.get("/health", (req, res) => {
    res.type("text/plain").send("OK");
});

myApp.get("/api/books", (req, res) => {
    const bookTitle = req.query.name;
    const writer = req.query.author;
    const category = req.query.genre;

    if (bookTitle || writer || category) {
        const matchingBooks = libraryBooks.filter((item) => {
            const matchTitle = !bookTitle || item.name.toLowerCase().includes(bookTitle.toLowerCase());
            const matchWriter = !writer || item.author.toLowerCase().includes(writer.toLowerCase());
            const matchCategory = !category || item.genre.toLowerCase().includes(category.toLowerCase());
            return matchTitle && matchWriter && matchCategory;
        });

        appEmitter.emit("searchLogged", {
            queryCriteria: { name: bookTitle, author: writer, genre: category },
            totalFound: matchingBooks.length
        });

        if (matchingBooks.length === 0) {
            return res.status(404).json({ error: "No matching books available" });
        }
        return res.json(matchingBooks);
    } else {
        return res.json(libraryBooks);
    }
});

myApp.get("/api/books/:id", (req, res) => {
    const foundBook = libraryBooks.find((item) => item.id === Number(req.params.id));
    if (!foundBook) {
        return res.status(404).json({ error: "Book record not found" });
    }
    res.json(foundBook);
});

myApp.get("/api/customers", (req, res) => {
    const clientName = req.query.name;
    const clientCity = req.query.city;

    if (clientName || clientCity) {
        const matchingClients = registeredCustomers.filter((client) => {
            const matchName = !clientName || client.name.toLowerCase().includes(clientName.toLowerCase());
            const matchCity = !clientCity || client.city.toLowerCase().includes(clientCity.toLowerCase());
            return matchName && matchCity;
        });

        appEmitter.emit("searchLogged", {
            queryCriteria: { name: clientName, city: clientCity },
            totalFound: matchingClients.length
        });

        if (matchingClients.length === 0) {
            return res.status(404).json({ error: "Customer profile not found" });
        }
        return res.json(matchingClients);
    } else {
        return res.json(registeredCustomers);
    }
});

// ------ ORDERS ENDPOINT -------
myApp.get("/api/orders", (req, res) => {
    const orderStatus = req.query.status;
    const orderDateVal = req.query.orderDate;

    if (orderStatus || orderDateVal) {
        const matchingOrders = storeOrders.filter((order) => {
            const matchStatus = !orderStatus || order.status.toLowerCase() === orderStatus.toLowerCase();
            const matchDate = !orderDateVal || order.orderDate.toLowerCase().includes(orderDateVal.toLowerCase());
            return matchStatus && matchDate;
        });

        appEmitter.emit("searchLogged", {
            queryCriteria: { status: orderStatus, orderDate: orderDateVal },
            totalFound: matchingOrders.length
        });

        if (matchingOrders.length === 0) {
            return res.status(404).json({ error: "Orders not found" });
        }
        return res.json(matchingOrders);
    } else {
        return res.json(storeOrders);
    }
});

myApp.get("/api/orders/:id", (req, res) => {
    const singleOrder = storeOrders.find((order) => order.id === Number(req.params.id));
    if (!singleOrder) {
        return res.status(404).json({ error: "Requested order does not exist" });
    }
    res.json(singleOrder);
});

myApp.post("/api/orders/:id/send-receipt", (req, res) => {
    const targetOrder = storeOrders.find((order) => order.id === Number(req.params.id));
    const recipientEmail = req.query.to;

    if (!targetOrder || !recipientEmail) {
        return res.type('text/plain').send("Please provide valid order ID and recipient email query parameters.");
    }

    res.json({
        status: "Success",
        sentTo: recipientEmail,
        mailSubject: `Invoice & Details for Order #${targetOrder.id}`,
        mailBody: `Dear customer, your order status is currently marked as: ${targetOrder.status}`
    });
});

myApp.use((req, res) => {
    res.status(404).json({ error: "Endpoint / Route not found" });
});

myApp.listen(3000, () => {
    console.log("Server is up and running on port 3000");
});