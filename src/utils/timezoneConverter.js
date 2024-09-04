export function unixToUtcToEat(unixTimestamp) {
    // Create a Date object from the Unix timestamp
    const date = new Date(unixTimestamp * 1000);

    // Get UTC time
    const utcTime = date.toUTCString();

    // Convert UTC time to EAT (offset is +3 hours)
    const eatTime = new Date(utcTime);
    eatTime.setHours(eatTime.getHours() + 3);

    return eatTime;
}