export function calculateDuration(startTimeStr: string): string {
  if (!startTimeStr) return "";
  const currentTime = new Date();
  const startTime = calculateStartTime(startTimeStr);
  const diff = Math.abs(currentTime.getTime() - startTime.getTime());
  const durationHours = Math.floor(diff / (1000 * 60 * 60));
  const durationMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${durationHours} hours ${durationMinutes} minutes`;
}

export function calculateStartTime(startTimeStr: string): Date {
  const regex = /(\d+)\s+(\w+)\s+ago/;
  const match = regex.exec(startTimeStr);

  if (match && match.length === 3) {
    const amount = parseInt(match[1]);
    const unit = match[2];

    const currentTime = new Date();
    let startTime = new Date(currentTime);

    // Subtract the amount of time from the current time based on the unit
    switch (unit) {
      case "minutes":
        startTime.setMinutes(currentTime.getMinutes() - amount);
        break;
      case "hours":
        startTime.setHours(currentTime.getHours() - amount);
        break;
      case "days":
        startTime.setDate(currentTime.getDate() - amount);
        break;
      // Add more cases as needed for other units
      default:
        console.error("Unsupported time unit:", unit);
    }

    return startTime;
  } else {
    console.error("Invalid start time format:", startTimeStr);
    return new Date();
  }
}
