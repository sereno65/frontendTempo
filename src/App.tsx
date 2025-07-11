import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import SalesForm from "./components/forms/SalesForm";
import DeliveryNoteForm from "./components/forms/DeliveryNoteForm";
import DeliveryNotesHistory from "./components/purchases/DeliveryNotesHistory";
import PurchaseOrderForm from "./components/forms/PurchaseOrderForm";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sales/new" element={<SalesForm />} />
          <Route path="/purchases/new" element={<DeliveryNoteForm />} />
          <Route path="/purchases/history" element={<DeliveryNotesHistory />} />
          <Route path="/purchases/orders" element={<PurchaseOrderForm />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
