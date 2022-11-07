// import './App.css';
import AppProvider from "./Contexts/AppContext";
import SocialMediaApp from "./SocialMediaApp";

function App() {
  return (
    <div className="App">
      <AppProvider>
        <SocialMediaApp />
      </AppProvider>
    </div>
  );
}

export default App;
