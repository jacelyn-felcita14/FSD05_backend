import ticket from '../Models/ticketModel.js';

export const createTicket = async (req, res) => {   
    try {
        const { title, description, priority, assignedTo } = req.body;
        const newTicket = await ticket.create({
            title,
            description,
            createdBy: req.user._id
        });

        res.status(201).json({ message: "Ticket created successfully", ticket: newTicket });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
};
export const getTickets = async (req, res) => {
    try {
        const tickets = await ticket.find()
            .populate('createdBy', 'name email')
            .populate('acceptedBy', 'name email')
            .populate('closedBy', 'name email');

        res.status(200).json({ tickets });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const updateTicketStatus = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { status } = req.body;
        const updatedTicket = await ticket.findByIdAndUpdate(
            ticketId,
            { status },
            { new: true }
        );
        res.status(200).json({ message: "Ticket status updated successfully", ticket: updatedTicket });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
};