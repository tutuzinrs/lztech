import logoImg from '../images/logo.PNG'

export default function Logo({ alt = 'LZ Tech', className = '' }) {
  return <img src={logoImg} alt={alt} className={`logo-img ${className}`.trim()} />
}
