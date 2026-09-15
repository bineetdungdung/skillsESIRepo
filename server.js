const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const orders = [
    { id: 101, customerId: 1, item: 'Laptop', total: 1200 },
    { id: 102, customerId: 1, item: 'Mouse', total: 40 },
    { id: 201, customerId: 2, item: 'Keyboard', total: 80 },
    { id: 301, customerId: 3, item: 'Monitor', total: 350 },
    { id: 302, customerId: 3, item: 'Desk Chair', total: 220 },
    { id: 303, customerId: 3, item: 'USB Hub', total: 55 }
];

const users = [
    { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', phone: '+1-555-0101' },
    { id: 2, firstName: 'Brian', lastName: 'Clark', email: 'brian@example.com', phone: '+1-555-0102' },
    { id: 3, firstName: 'Charlie', lastName: 'Nguyen', email: 'charlie@example.com', phone: '+1-555-0103' }
];

app.get('/api/orders/:customerId', (req, res) => {
    const customerId = Number(req.params.customerId);

    if (!Number.isInteger(customerId) || customerId <= 0) {
        return res.status(400).json({
            error: 'Invalid customerId. Please provide a positive integer.'
        });
    }

    const customerOrders = orders.filter((order) => order.customerId === customerId);

    if (customerOrders.length === 0) {
        return res.status(404).json({
            message: `No orders found for customerId ${customerId}`
        });
    }

    return res.status(200).json({
        customerId,
        count: customerOrders.length,
        data: customerOrders
    });
});

app.put('/api/users/:userId', (req, res) => {
    const userId = Number(req.params.userId);

    if (!Number.isInteger(userId) || userId <= 0) {
        return res.status(400).json({
            error: 'Invalid userId. Please provide a positive integer.'
        });
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({
            error: 'Request body must be a JSON object.'
        });
    }

    const allowedFields = ['firstName', 'lastName', 'email', 'phone'];
    const invalidFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        return res.status(400).json({
            error: `Invalid profile field(s): ${invalidFields.join(', ')}`
        });
    }

    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({
            message: `User with id ${userId} was not found.`
        });
    }

    const profileUpdates = req.body;
    const updatedUser = { ...users[userIndex] };

    if ('firstName' in profileUpdates) {
        const firstName = String(profileUpdates.firstName).trim();

        if (!firstName) {
            return res.status(400).json({ error: 'firstName cannot be empty.' });
        }

        updatedUser.firstName = firstName;
    }

    if ('lastName' in profileUpdates) {
        const lastName = String(profileUpdates.lastName).trim();

        if (!lastName) {
            return res.status(400).json({ error: 'lastName cannot be empty.' });
        }

        updatedUser.lastName = lastName;
    }

    if ('email' in profileUpdates) {
        const email = String(profileUpdates.email).trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'email must be a valid email address.' });
        }

        updatedUser.email = email;
    }

    if ('phone' in profileUpdates) {
        const phone = String(profileUpdates.phone).trim();

        if (!phone) {
            return res.status(400).json({ error: 'phone cannot be empty.' });
        }

        updatedUser.phone = phone;
    }

    users[userIndex] = updatedUser;

    return res.status(200).json({
        message: 'User profile updated successfully.',
        data: updatedUser
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
