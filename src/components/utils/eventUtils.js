export const getTicketsAvailable = (event) => {
    const total = event.totalTickets || 0;
    const sold = event.ticketsSold || 0;
    return total - sold;
};

export const isSoldOut = (event) => {
    return getTicketsAvailable(event) <= 0;
};
