import { ProductsExplorer } from './components/ProductsExplorer'
import './App.css'

function App() {
  return (
    <main>
      <header className="app-header">
        <h1>Build your security bundle</h1>
        <p>Pick the products for your setup, organized by category.</p>
      </header>
      <ProductsExplorer />
    </main>
  )
}

export default App
