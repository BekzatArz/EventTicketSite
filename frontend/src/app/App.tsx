import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./AppRoutes"
import Notify from "../shared/notify/ui/Notify"
import Header from "../shared/ui/header/Header"

const App = () => {
  return (
    <Router>
      <div className="app">
      <Header />
      <Notify />
        <AppRoutes />
      </div>
    </Router>
  )
}

export default App

