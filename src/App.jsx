import Home from "./pages/Home";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      {/* This component sits invisibly and manages the popups */}
      <Toaster position="top-right" reverseOrder={false} />
      <Home />
    </div>
  );
}
export default App;
