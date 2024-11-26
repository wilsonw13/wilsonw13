const awards = [
  {
    title: "Dean's List",
    dateRange: "Jan 2023 - Present",
  },
  {
    title: "Presidential Scholarship",
    dateRange: "Aug 2022 - Present",
  },
];

export default function Awards() {
  return (
    <div id="awards-section">
      {awards.map((award, i) => (
        <div key={i} className="item">
          <div className="title">{award.title}</div>
          <div className="date">{award.dateRange}</div>
        </div>
      ))}
    </div>
  );
}
