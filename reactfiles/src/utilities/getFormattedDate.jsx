function getFormattedDate(date) {
  let now = Date.now();
  let delta = Math.abs(now - date) / 1000;

  // calculate (and subtract) whole days
  let days = Math.floor(delta / 86400);
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  let hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  let minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  let formattedDate;

  if (days >= 1 && days < 2) {
    formattedDate = `${days} day ago`;
  } else if (days >= 2) {
    formattedDate = `${days} days ago`;
  } else if (hours >= 1 && hours < 2) {
    formattedDate = `${hours} hour ago`;
  } else if (hours > 1) {
    formattedDate = `${hours} hours ago`;
  } else if (minutes >= 1 && minutes < 2) {
    formattedDate = `${minutes} min ago`;
  } else if (minutes > 1) {
    formattedDate = `${minutes} mins ago`;
  } else {
    formattedDate = "1 min ago";
  }

  return formattedDate;
}

export default getFormattedDate;
