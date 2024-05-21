import PopupContent from './PopupContent'
import { ThemeProvider } from '../context/themeContext'
import '../../scss/popup/popup.scss'

function PopupDrag() {
  return (
    <ThemeProvider>
      <div className='popupBody'>
        <div className='myDiv'>
          <PopupContent />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default PopupDrag
