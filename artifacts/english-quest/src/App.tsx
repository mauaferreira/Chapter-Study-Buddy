import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Home } from "@/pages/Home";
import { Flashcards } from "@/pages/Flashcards";
import { Quiz } from "@/pages/Quiz";
import { Unscramble } from "@/pages/Unscramble";
import { ListenAndMatch } from "@/pages/ListenAndMatch";
import { PicturePrepositions } from "@/pages/PicturePrepositions";
import { DoesDoesnt } from "@/pages/DoesDoesnt";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/flashcards" component={Flashcards} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/unscramble" component={Unscramble} />
      <Route path="/listen-and-match" component={ListenAndMatch} />
      <Route path="/picture-prepositions" component={PicturePrepositions} />
      <Route path="/does-doesnt" component={DoesDoesnt} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
