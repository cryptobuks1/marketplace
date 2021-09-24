export const getStartOfWeek = (d) => {
    d = new Date(d)
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1) // adjust when day is sunday
    let monday = new Date(d.setDate(diff))
    return monday.toLocaleDateString();
  }