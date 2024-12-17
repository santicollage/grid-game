import './Background.scss'

function Background() {

  const stars = [];
  const totalStars = 200;

  for (let index = 0; index < totalStars; index++) {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const size = Math.floor(Math.random() * 5);
    const duration = Math.floor(Math.random() * 10) + 8;
    stars.push({x, y, size, duration})
  }
  

  return (
    <>
      <div className="background-container">
        {stars.map((star, index) => (
          <div 
          className="star" 
          style={{top: `${star.y}vh`, left: `${star.x}vw`, width: `${star.size}px`, height: `${star.size + 2}px`, animationDuration: `${star.duration}s`}} 
          key={index}>
          </div>
        ))}
        {stars.map((star, index) => (
          <div 
          className="star" 
          style={{top: `${star.y + 100}vh`, left: `${star.x}vw`, width: `${star.size}px`, height: `${star.size + 2}px`, animationDuration: `${star.duration}s`}} 
          key={index}>
          </div>
        ))}
      </div>
    </>
  )
}

export {Background}
