import logo from '../../Images/logo.png';
import '../../CSS/AI/aibutton.css'

const AiButton = ({setAi}) => {
  return <section className='ai-button' onClick={()=>{setAi(true)}}>
    <img src={logo} alt="logo" height={20}/>
  </section>
}

export default AiButton