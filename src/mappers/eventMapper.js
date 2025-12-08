export const mapEventRequest = (form) => ({
    title: form.title,
    description: form.description,
    location: form.location,
    startAt: form.startAt,
    endAt: form.endAt,
    totalTickets: form.totalTickets,
    ticketPrice: form.ticketPrice,
    //imageUrl: form.imageUrl,
    category:form.category,
    organizerId:form.organizerId
    // organizerId sera ajouté côté backend grâce à UserPrincipal.
});
