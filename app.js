(function(){
"use strict";
/* ---------- language ---------- */
const LANGS = {sv:{name:"Svenska", loc:"sv-SE", ai:"svenska"}, nb:{name:"Norsk", loc:"nb-NO", ai:"norska (bokmål)"}, da:{name:"Dansk", loc:"da-DK", ai:"danska"}, en:{name:"English", loc:"en-GB", ai:"engelska"}};
function detectLang(){
  try { const v = localStorage.getItem("vardagen.lang"); if (v && LANGS[v]) return v; } catch(e) {}
  const n = (navigator.language || "sv").toLowerCase();
  return /^(nb|nn|no)/.test(n) ? "nb" : /^da/.test(n) ? "da" : /^sv/.test(n) ? "sv" : /^en/.test(n) ? "en" : "sv";
}
let LANG = detectLang(), LOC = LANGS[LANG].loc;
const aiLang = () => LANGS[LANG].ai;
const LIX = {en:0, nb:1, da:2};
// The app is written in Swedish; every other language is a lookup on the Swedish text as it is shown.
const I18N_DICT = {"Kalender": ["Calendar", "Kalender", "Kalender"], "Kvitton": ["Receipts", "Kvitteringer", "Kvitteringer"], "Lov": ["Holidays", "Ferier", "Ferier"], "Inköp": ["Shopping", "Innkjøp", "Indkøb"], "Sysslor": ["Chores", "Oppgaver i hjemmet", "Huslige pligter"], "Barn & föräldrar": ["Children & parents", "Barn og foreldre", "Børn og forældre"], "Barn & vi": ["Children & us", "Barn og oss", "Børn og os"], "Vi två": ["The two of us", "Oss to", "Os to"], "Vi vuxna": ["The adults", "Oss voksne", "Os voksne"], "Föräldrar": ["Parents", "Foreldre", "Forældre"], "Budget": ["Budget", "Budsjett", "Budget"], "Listor": ["Lists", "Lister", "Lister"], "Familjen": ["Family", "Familien", "Familien"], "Hemmet": ["Home", "Hjemmet", "Hjemmet"], "Mitt": ["Mine", "Mitt", "Mit"], "Mina": ["Mine", "Mine", "Mine"], "Alla": ["All", "Alle", "Alle"], "Gemensamma": ["Shared", "Felles", "Fælles"], "Till startsidan": ["To the start page", "Til startsiden", "Til forsiden"], "Notiser": ["Notifications", "Varsler", "Notifikationer"], "Inställningar": ["Settings", "Innstillinger", "Indstillinger"], "Stäng": ["Close", "Lukk", "Luk"], "Exempeldata.": ["Example data.", "Eksempeldata.", "Eksempeldata."], "Appen kan inte nå sin lagring här. Öppna länken inloggad på claude.ai för att använda den på riktigt.": ["The app can't reach its storage here. Open the link signed in to claude.ai to use it for real.", "Appen får ikke kontakt med lagringen her. Åpne lenken innlogget på claude.ai for å bruke den på ordentlig.", "Appen kan ikke nå sin lagring her. Åbn linket logget ind på claude.ai for at bruge den rigtigt."], "Ansluter…": ["Connecting…", "Kobler til…", "Forbinder…"], "Förhandsvisning med exempeldata.": ["Preview with example data.", "Forhåndsvisning med eksempeldata.", "Forhåndsvisning med eksempeldata."], "Så här kommer Hemmet med en ny partner att fungera. Ditt ex ser aldrig Hemmet, och din partner ser aldrig Familjen. I testversionen sparas inget här, eftersom alla som bjuds in till appen kan läsa allt som delas i den. Det kräver den riktiga appen.": ["This is how Home with a new partner will work. Your ex never sees Home, and your partner never sees Family. Nothing is saved here in the test version, because everyone invited to the app can read everything shared in it. That requires the real app.", "Slik kommer Hjemmet med en ny partner til å fungere. Eksen din ser aldri Hjemmet, og partneren din ser aldri Familien. I testversjonen lagres ingenting her, fordi alle som inviteres til appen kan lese alt som deles i den. Det krever den ekte appen.", "Sådan kommer Hjemmet med en ny partner til at fungere. Din eks ser aldrig Hjemmet, og din partner ser aldrig Familien. I testversionen gemmes intet her, fordi alle der inviteres til appen kan læse alt, der deles i den. Det kræver den rigtige app."], "Du kan bara läsa. Be den som skapade appen att dela den med dig som": ["You can only read. Ask the person who created the app to share it with you as", "Du kan bare lese. Be den som laget appen om å dele den med deg som", "Du kan kun læse. Bed den, der oprettede appen, om at dele den med dig som"], "Redigerare": ["Editor", "Redaktør", "Redaktør"], "Bara du ser detta": ["Only you see this", "Bare du ser dette", "Kun du ser dette"], "Privat – bara du ser detta": ["Private – only you see this", "Privat – bare du ser dette", "Privat – kun du ser dette"], "Privat – syns bara för dig": ["Private – visible only to you", "Privat – synlig bare for deg", "Privat – kun synlig for dig"], "Privat": ["Private", "Privat", "Privat"], "Privat budget": ["Private budget", "Privat budsjett", "Privat budget"], "I din privata del": ["In your private part", "I din private del", "I din private del"], "Ni är kvitt": ["You're even", "Dere er skuls", "I er kvit"], "Att ta hand om": ["Needs your attention", "Trenger oppmerksomhet", "Kræver din opmærksomhed"], "Lägg till snabbt": ["Quick add", "Legg til raskt", "Tilføj hurtigt"], "Listor och din egen kalender": ["Lists and your own calendar", "Lister og din egen kalender", "Lister og din egen kalender"], "T.ex. mjölk på inköpslistan": ["E.g. milk on the shopping list", "F.eks. melk på handlelisten", "F.eks. mælk på indkøbslisten"], "Lägg till i listor eller din kalender": ["Add to lists or your calendar", "Legg til i lister eller kalenderen din", "Tilføj til lister eller din kalender"], "Lägg till": ["Add", "Legg til", "Tilføj"], "Mjölk och bröd på inköpslistan": ["Milk and bread on the shopping list", "Melk og brød på handlelisten", "Mælk og brød på indkøbslisten"], "Padel på torsdag kl 19": ["Padel on Thursday at 19", "Padel på torsdag kl 19", "Padel på torsdag kl 19"], "Lägg in i kalendern": ["Add to the calendar", "Legg inn i kalenderen", "Tilføj til kalenderen"], "Idag och i morgon": ["Today and tomorrow", "I dag og i morgen", "I dag og i morgen"], "Idag": ["Today", "I dag", "I dag"], "idag": ["today", "i dag", "i dag"], "I morgon": ["Tomorrow", "I morgen", "I morgen"], "i morgon": ["tomorrow", "i morgen", "i morgen"], "Inget inplanerat. Skriv t.ex. \"padel på torsdag kl 19\" ovan.": ["Nothing planned. Type e.g. \"padel on Thursday at 19\" above.", "Ingenting planlagt. Skriv f.eks. «padel på torsdag kl 19» ovenfor.", "Intet planlagt. Skriv f.eks. \"padel på torsdag kl 19\" ovenfor."], "Inköpslista": ["Shopping list", "Handleliste", "Indkøbsliste"], "Att göra": ["To-do", "Gjøremål", "Opgaver"], "Tom": ["Empty", "Tom", "Tom"], "Allt klart": ["All done", "Alt gjort", "Alt klaret"], "Inget idag": ["Nothing today", "Ingenting i dag", "Intet i dag"], "Turas om med städning, disk och sopor": ["Take turns with cleaning, dishes and rubbish", "Bytt på med vask, oppvask og søppel", "Skiftes til rengøring, opvask og skrald"], "Middagstips med AI": ["Dinner ideas with AI", "Middagstips med AI", "Middagsidéer med AI"], "Middagstips": ["Dinner ideas", "Middagstips", "Middagsidéer"], "Få förslag på rätter och lägg ingredienserna på inköpslistan": ["Get dish ideas and put the ingredients on the shopping list", "Få forslag til retter og legg ingrediensene på handlelisten", "Få forslag til retter og læg ingredienserne på indkøbslisten"], "Ditt hem med din partner": ["Your home with your partner", "Ditt hjem med partneren din", "Dit hjem med din partner"], "förhandsvisning": ["preview", "forhåndsvisning", "forhåndsvisning"], "exempel": ["example", "eksempel", "eksempel"], "Förfrågan om byte": ["Swap request", "Forespørsel om bytte", "Anmodning om bytte"], "Väntar på svar": ["Waiting for an answer", "Venter på svar", "Venter på svar"], "Ja, det går bra": ["Yes, that's fine", "Ja, det går fint", "Ja, det er fint"], "Nej": ["No", "Nei", "Nej"], "Ta tillbaka": ["Withdraw", "Trekk tilbake", "Træk tilbage"], "Tack, läst": ["Thanks, read", "Takk, lest", "Tak, læst"], "Läst": ["Read", "Lest", "Læst"], "Inte läst än": ["Not read yet", "Ikke lest ennå", "Ikke læst endnu"], "Byte den här dagen": ["Changeover this day", "Bytte denne dagen", "Skift denne dag"], "Enligt schemat": ["According to the schedule", "Ifølge timeplanen", "Ifølge skemaet"], "Inget boendeschema": ["No living schedule", "Ingen bostedsplan", "Ingen samværsplan"], "Inget boendeschema än": ["No living schedule yet", "Ingen bostedsplan ennå", "Ingen samværsplan endnu"], "Lägg in ert schema så fylls kalendern i": ["Add your schedule and the calendar fills in", "Legg inn planen deres, så fylles kalenderen ut", "Indtast jeres skema, så udfyldes kalenderen"], "Be om byte": ["Ask to swap", "Be om bytte", "Bed om bytte"], "Lägg in schema": ["Add schedule", "Legg inn plan", "Indtast skema"], "Lägg in boendeschema": ["Add living schedule", "Legg inn bostedsplan", "Indtast samværsplan"], "Ändra schema": ["Change schedule", "Endre plan", "Ændr skema"], "Ändra": ["Edit", "Endre", "Ændr"], "Barnen bor hos er": ["The children live with you", "Barna bor hos dere", "Børnene bor hos jer"], "Barnen är hos andra föräldern": ["The children are with the other parent", "Barna er hos den andre forelderen", "Børnene er hos den anden forælder"], "Barnen är hos dig": ["The children are with you", "Barna er hos deg", "Børnene er hos dig"], "Från Familjens boendeschema": ["From the family living schedule", "Fra familiens bostedsplan", "Fra familiens samværsplan"], "bara läsning": ["read only", "kun lesing", "kun læsning"], "Händelse": ["Event", "Hendelse", "Begivenhed"], "Inget den här dagen.": ["Nothing this day.", "Ingenting denne dagen.", "Intet denne dag."], "Heldag": ["All day", "Hele dagen", "Hele dagen"], "Aktivitet": ["Activity", "Aktivitet", "Aktivitet"], "Lek hos kompis": ["Playdate", "Lek hos venn", "Legeaftale"], "Skola / förskola": ["School / preschool", "Skole / barnehage", "Skole / børnehave"], "Hämtning / lämning": ["Pick-up / drop-off", "Henting / levering", "Afhentning / aflevering"], "Bor hos": ["Lives with", "Bor hos", "Bor hos"], "Annat": ["Other", "Annet", "Andet"], "Börja med barnen": ["Start with the children", "Begynn med barna", "Start med børnene"], "Lägg till barnens namn så kan ni koppla händelser och kvitton till dem.": ["Add the children's names so you can link events and receipts to them.", "Legg til barnas navn, så kan dere koble hendelser og kvitteringer til dem.", "Tilføj børnenes navne, så I kan knytte begivenheder og kvitteringer til dem."], "Lägg till barn": ["Add child", "Legg til barn", "Tilføj barn"], "Att jämna ut": ["To settle", "Å gjøre opp", "At udligne"], "Skanna kvitto": ["Scan receipt", "Skann kvittering", "Scan kvittering"], "Skriv in utan kvitto": ["Enter without receipt", "Skriv inn uten kvittering", "Indtast uden kvittering"], "Kvitton och betalningar": ["Receipts and payments", "Kvitteringer og betalinger", "Kvitteringer og betalinger"], "Inga kvitton än. Fota ett kvitto så räknar appen ut vem som ska betala vad.": ["No receipts yet. Take a photo of a receipt and the app works out who pays what.", "Ingen kvitteringer ennå. Ta bilde av en kvittering, så regner appen ut hvem som skal betale hva.", "Ingen kvitteringer endnu. Tag et billede af en kvittering, så regner appen ud, hvem der skal betale hvad."], "Du betalade": ["You paid", "Du betalte", "Du betalte"], "ingen delning": ["not split", "ingen deling", "ingen deling"], "Barnen": ["Children", "Barna", "Børnene"], "Inga barn tillagda än.": ["No children added yet.", "Ingen barn lagt til ennå.", "Ingen børn tilføjet endnu."], "Tryck för att byta namn": ["Tap to change name", "Trykk for å endre navn", "Tryk for at ændre navn"], "Gemensam kalender och kvitton": ["Shared calendar and receipts", "Felles kalender og kvitteringer", "Fælles kalender og kvitteringer"], "Tryck för att fylla i barnkortet": ["Tap to fill in the child card", "Trykk for å fylle ut barnekortet", "Tryk for at udfylde børnekortet"], "allergi": ["allergy", "allergi", "allergi"], "Packlista vid byte": ["Packing list for changeover", "Pakkeliste ved bytte", "Pakkeliste ved skift"], "Avbocka allt": ["Uncheck all", "Fjern alle haker", "Fjern alle flueben"], "Saker som ska följa med mellan hemmen. Ni ser samma lista.": ["Things that travel between the homes. You both see the same list.", "Ting som skal være med mellom hjemmene. Dere ser samme liste.", "Ting der skal med mellem hjemmene. I ser samme liste."], "Ex. gympapåse, laddare, gosedjur.": ["E.g. PE bag, charger, cuddly toy.", "F.eks. gymbag, lader, kosedyr.", "F.eks. idrætstaske, oplader, tøjdyr."], "Lägg till sak": ["Add item", "Legg til ting", "Tilføj ting"], "Packlista: ny sak": ["Packing list: new item", "Pakkeliste: ny ting", "Pakkeliste: ny ting"], "Hälsningar vid byte": ["Messages at changeover", "Hilsener ved bytte", "Hilsner ved skift"], "Skriv hälsning": ["Write message", "Skriv hilsen", "Skriv hilsen"], "Det som ligger under": ["What's under", "Det som ligger under", "Det, der ligger under"], "ser bara du, även efter att ni delat.": ["only you see, even after you share.", "ser bare du, også etter at dere har delt.", "ser kun du, også efter I har delt."], "Tryck på": ["Tap", "Trykk på", "Tryk på"], "Dela": ["Share", "Del", "Del"], "uppe till höger i Claude.": ["at the top right in Claude.", "øverst til høyre i Claude.", "øverst til højre i Claude."], "Skriv in e-postadressen och välj": ["Enter the email address and choose", "Skriv inn e-postadressen og velg", "Indtast e-mailadressen og vælg"], "Månad": ["Month", "Måned", "Måned"], "År": ["Year", "År", "År"], "Tryck på en stapel": ["Tap a bar", "Trykk på en søyle", "Tryk på en søjle"], "Fasta kostnader": ["Fixed costs", "Faste kostnader", "Faste udgifter"], "Per kategori": ["By category", "Per kategori", "Per kategori"], "Sätt budget": ["Set budget", "Sett budsjett", "Sæt budget"], "Sparmål": ["Savings goals", "Sparemål", "Sparemål"], "Nytt mål": ["New goal", "Nytt mål", "Nyt mål"], "Sätt in": ["Deposit", "Sett inn", "Indsæt"], "Ta ut": ["Withdraw", "Ta ut", "Hæv"], "Målet är nått!": ["Goal reached!", "Målet er nådd!", "Målet er nået!"], "Spara till något, t.ex. en resa eller en buffert. Du ser hur mycket som är kvar och hur mycket du behöver spara per månad.": ["Save for something, e.g. a trip or a buffer. You see how much is left and how much to save each month.", "Spar til noe, f.eks. en reise eller en buffer. Du ser hvor mye som gjenstår og hvor mye du må spare per måned.", "Spar op til noget, f.eks. en rejse eller en buffer. Du ser, hvor meget der mangler, og hvor meget du skal spare om måneden."], "Projekt": ["Projects", "Prosjekter", "Projekter"], "Nytt projekt": ["New project", "Nytt prosjekt", "Nyt projekt"], "Klart": ["Done", "Ferdig", "Færdig"], "Samla kostnaderna för t.ex. en renovering eller ett nytt kök och följ dem mot en budget.": ["Collect the costs of e.g. a renovation or a new kitchen and track them against a budget.", "Samle kostnadene for f.eks. en oppussing eller et nytt kjøkken og følg dem mot et budsjett.", "Saml udgifterne til f.eks. en renovering eller et nyt køkken og følg dem mod et budget."], "Inga kvitton kopplade än.": ["No receipts linked yet.", "Ingen kvitteringer koblet ennå.", "Ingen kvitteringer tilknyttet endnu."], "Alla kvitton sparas med bild, så du slipper spara papperslappar. Sök t.ex. på \"tv\".": ["All receipts are saved with a photo, so you don't have to keep paper slips. Search e.g. for \"tv\".", "Alle kvitteringer lagres med bilde, så du slipper å ta vare på papirlapper. Søk f.eks. på «tv».", "Alle kvitteringer gemmes med billede, så du slipper at gemme papirlapper. Søg f.eks. på \"tv\"."], "Sök butik eller vara": ["Search shop or item", "Søk butikk eller vare", "Søg butik eller vare"], "Sök kvitton": ["Search receipts", "Søk i kvitteringer", "Søg i kvitteringer"], "Inga kvitton sparade än.": ["No receipts saved yet.", "Ingen kvitteringer lagret ennå.", "Ingen kvitteringer gemt endnu."], "Visar de 100 senaste. Sök för att hitta äldre.": ["Showing the latest 100. Search to find older ones.", "Viser de 100 siste. Søk for å finne eldre.", "Viser de seneste 100. Søg for at finde ældre."], "reklamationstiden slut": ["complaint period over", "reklamasjonstiden er ute", "reklamationsretten er udløbet"], "Visa familjens kalender": ["Show the family calendar", "Vis familiens kalender", "Vis familiens kalender"], "Visa hemmets kalender": ["Show the home calendar", "Vis hjemmets kalender", "Vis hjemmets kalender"], "Dina egna händelser ser bara du.": ["Only you see your own events.", "Bare du ser dine egne hendelser.", "Kun du ser dine egne begivenheder."], "Lägg in dina barn": ["Add your children", "Legg inn barna dine", "Tilføj dine børn"], "Mina barn": ["My children", "Mine barn", "Mine børn"], "Inget att handla.": ["Nothing to buy.", "Ingenting å handle.", "Intet at købe."], "Inget att göra.": ["Nothing to do.", "Ingenting å gjøre.", "Intet at gøre."], "Rensa avbockade": ["Clear checked", "Fjern avkryssede", "Ryd afkrydsede"], "Lägg till vara": ["Add item", "Legg til vare", "Tilføj vare"], "Ny uppgift": ["New task", "Ny oppgave", "Ny opgave"], "Inköpslista: ny rad": ["Shopping list: new line", "Handleliste: ny linje", "Indkøbsliste: ny linje"], "Att göra: ny rad": ["To-do: new line", "Gjøremål: ny linje", "Opgaver: ny linje"], "Ny syssla": ["New chore", "Ny oppgave", "Ny pligt"], "Din tur": ["Your turn", "Din tur", "Din tur"], "sedan du": ["then you", "deretter deg", "derefter dig"], "Turordningen går runt automatiskt när någon bockar av.": ["The turn passes on automatically when someone checks it off.", "Turen går videre automatisk når noen krysser av.", "Turen går automatisk videre, når nogen krydser af."], "Ni ser och bockar av samma lista. Den finns också under Listor i Mitt.": ["You see and check off the same list. It's also under Lists in Mine.", "Dere ser og krysser av samme liste. Den finnes også under Lister i Mitt.", "I ser og krydser af på samme liste. Den findes også under Lister i Mit."], "Planera lov": ["Plan holidays", "Planlegg ferier", "Planlæg ferier"], "Inga lov planerade än. Börja t.ex. med jul och nyår.": ["No holidays planned yet. Start e.g. with Christmas and New Year.", "Ingen ferier planlagt ennå. Begynn f.eks. med jul og nyttår.", "Ingen ferier planlagt endnu. Start f.eks. med jul og nytår."], "Väntar": ["Waiting", "Venter", "Venter"], "Höstlov": ["Autumn break", "Høstferie", "Efterårsferie"], "Jullov": ["Christmas break", "Juleferie", "Juleferie"], "Julafton": ["Christmas Eve", "Julaften", "Juleaften"], "Nyår": ["New Year", "Nyttår", "Nytår"], "Sportlov": ["Winter break", "Vinterferie", "Vinterferie"], "Påsklov": ["Easter break", "Påskeferie", "Påskeferie"], "Sommarlov": ["Summer holidays", "Sommerferie", "Sommerferie"], "Midsommar": ["Midsummer", "Sankthans", "Sankt Hans"], "Bytet": ["The swap", "Byttet", "Byttet"], "Kalender, budget och listor – bara för dig": ["Calendar, budget and lists – just for you", "Kalender, budsjett og lister – bare for deg", "Kalender, budget og lister – kun for dig"], "Delad barnkalender och kostnader med andra föräldern": ["Shared children's calendar and costs with the other parent", "Delt barnekalender og kostnader med den andre forelderen", "Delt børnekalender og udgifter med den anden forælder"], "Delad barnkalender med andra föräldern och ett eget hem med din partner": ["Shared children's calendar with the other parent and your own home with your partner", "Delt barnekalender med den andre forelderen og et eget hjem med partneren din", "Delt børnekalender med den anden forælder og et eget hjem med din partner"], "Delad kalender, hushållskostnader och inköpslista": ["Shared calendar, household costs and shopping list", "Delt kalender, husholdningskostnader og handleliste", "Delt kalender, husholdningsudgifter og indkøbsliste"], "Delad familjekalender, kostnader och inköpslista": ["Shared family calendar, costs and shopping list", "Delt familiekalender, kostnader og handleliste", "Delt familiekalender, udgifter og indkøbsliste"], "+ din privata del": ["+ your private part", "+ din private del", "+ din private del"], "Separerad med barn": ["Separated with children", "Separert med barn", "Separeret med børn"], "Separerad med barn + ny partner": ["Separated with children + new partner", "Separert med barn + ny partner", "Separeret med børn + ny partner"], "Bor ensam": ["Living alone", "Bor alene", "Bor alene"], "Sambo": ["Living together", "Samboer", "Samlevende"], "Sambo med barn": ["Living together with children", "Samboer med barn", "Samlevende med børn"], "Hur bor du?": ["How do you live?", "Hvordan bor du?", "Hvordan bor du?"], "Vad ska du heta i appen?": ["What should we call you in the app?", "Hva skal du hete i appen?", "Hvad skal du hedde i appen?"], "Ditt förnamn, eller t.ex. Mamma": ["Your first name, or e.g. Mum", "Fornavnet ditt, eller f.eks. Mamma", "Dit fornavn, eller f.eks. Mor"], "Din privata del heter": ["Your private part is called", "Den private delen din heter", "Din private del hedder"], ". Där har du egen kalender, budget, kvitton och listor som bara du ser.": [". There you have your own calendar, budget, receipts and lists that only you see.", ". Der har du egen kalender, budsjett, kvitteringer og lister som bare du ser.", ". Der har du egen kalender, budget, kvitteringer og lister, som kun du ser."], "Välkommen till Vardagen": ["Welcome to Vardagen", "Velkommen til Vardagen", "Velkommen til Vardagen"], "Berätta hur du bor, så anpassar vi appen efter dig. Du kan ändra det senare.": ["Tell us how you live and we'll adapt the app to you. You can change it later.", "Fortell hvordan du bor, så tilpasser vi appen etter deg. Du kan endre det senere.", "Fortæl, hvordan du bor, så tilpasser vi appen til dig. Du kan ændre det senere."], "Kom igång": ["Get started", "Kom i gang", "Kom i gang"], "Spara": ["Save", "Lagre", "Gem"], "Språk": ["Language", "Språk", "Sprog"], "Ditt namn": ["Your name", "Navnet ditt", "Dit navn"], "Mamma": ["Mum", "Mamma", "Mor"], "Pappa": ["Dad", "Pappa", "Far"], "Ny händelse": ["New event", "Ny hendelse", "Ny begivenhed"], "Ändra händelse": ["Edit event", "Endre hendelse", "Ændr begivenhed"], "Vad händer?": ["What's happening?", "Hva skjer?", "Hvad sker der?"], "Ex. Leker hos Saga": ["E.g. Playdate at Saga's", "F.eks. Leker hos Saga", "F.eks. Leger hos Saga"], "Ex. Padel": ["E.g. Padel", "F.eks. Padel", "F.eks. Padel"], "Typ": ["Type", "Type", "Type"], "Datum": ["Date", "Dato", "Dato"], "Ansvarig / hos": ["Responsible / with", "Ansvarlig / hos", "Ansvarlig / hos"], "Ingen särskild": ["No one in particular", "Ingen spesiell", "Ingen bestemt"], "Från (tom = heldag)": ["From (empty = all day)", "Fra (tom = hele dagen)", "Fra (tom = hele dagen)"], "Till": ["To", "Til", "Til"], "Vilka barn?": ["Which children?", "Hvilke barn?", "Hvilke børn?"], "Vilken kompis?": ["Which friend?", "Hvilken venn?", "Hvilken ven?"], "Välj kompis…": ["Choose friend…", "Velg venn…", "Vælg ven…"], "Förälderns nummer visas på händelsen.": ["The parent's number is shown on the event.", "Forelderens nummer vises på hendelsen.", "Forælderens nummer vises på begivenheden."], "Lägg till kompisar på barnkortet så kan du välja dem här.": ["Add friends on the child card and you can choose them here.", "Legg til venner på barnekortet, så kan du velge dem her.", "Tilføj venner på børnekortet, så kan du vælge dem her."], "Anteckning": ["Note", "Notat", "Note"], "Ex. vem som hämtar, packa gympapåse": ["E.g. who picks up, pack the PE bag", "F.eks. hvem som henter, pakk gymbagen", "F.eks. hvem der henter, pak idrætstasken"], "Upprepa varje vecka i": ["Repeat every week for", "Gjenta hver uke i", "Gentag hver uge i"], "veckor": ["weeks", "uker", "uger"], "Spara ändringar": ["Save changes", "Lagre endringer", "Gem ændringer"], "Ta bort händelsen": ["Delete event", "Slett hendelsen", "Slet begivenheden"], "Tryck igen för att ta bort": ["Tap again to delete", "Trykk igjen for å slette", "Tryk igen for at slette"], "Ny utgift": ["New expense", "Ny utgift", "Ny udgift"], "Ändra kvitto": ["Edit receipt", "Endre kvittering", "Ændr kvittering"], "Fota eller välj en bild på kvittot": ["Take or choose a photo of the receipt", "Ta eller velg et bilde av kvitteringen", "Tag eller vælg et billede af kvitteringen"], "AI läser butik, datum och belopp": ["AI reads shop, date and amount", "AI leser butikk, dato og beløp", "AI læser butik, dato og beløb"], "Läser kvittot… det tar oftast 10–40 sekunder.": ["Reading the receipt… it usually takes 10–40 seconds.", "Leser kvitteringen… det tar vanligvis 10–40 sekunder.", "Læser kvitteringen… det tager normalt 10–40 sekunder."], "AI-läsning är inte tillgänglig här. Fyll i uppgifterna själv.": ["AI reading isn't available here. Fill in the details yourself.", "AI-lesing er ikke tilgjengelig her. Fyll inn opplysningene selv.", "AI-læsning er ikke tilgængelig her. Udfyld oplysningerne selv."], "Det ser inte ut som ett kvitto.": ["That doesn't look like a receipt.", "Det ser ikke ut som en kvittering.", "Det ligner ikke en kvittering."], "För många förfrågningar just nu. Vänta en stund eller fyll i själv.": ["Too many requests right now. Wait a moment or fill in yourself.", "For mange forespørsler akkurat nå. Vent litt eller fyll inn selv.", "For mange forespørgsler lige nu. Vent lidt eller udfyld selv."], "AI-läsning nekades. Fyll i uppgifterna själv.": ["AI reading was declined. Fill in the details yourself.", "AI-lesing ble avslått. Fyll inn opplysningene selv.", "AI-læsning blev afvist. Udfyld oplysningerne selv."], "Bilden gick inte att läsa. Prova en annan bild.": ["The photo couldn't be read. Try another photo.", "Bildet kunne ikke leses. Prøv et annet bilde.", "Billedet kunne ikke læses. Prøv et andet billede."], "AI:n kunde inte tyda kvittot. Fyll i själv.": ["The AI couldn't make out the receipt. Fill in yourself.", "AI-en klarte ikke å tyde kvitteringen. Fyll inn selv.", "AI'en kunne ikke tyde kvitteringen. Udfyld selv."], "Avbrutet.": ["Cancelled.", "Avbrutt.", "Afbrudt."], "Kunde inte läsa kvittot. Fyll i uppgifterna själv.": ["Couldn't read the receipt. Fill in the details yourself.", "Kunne ikke lese kvitteringen. Fyll inn opplysningene selv.", "Kunne ikke læse kvitteringen. Udfyld oplysningerne selv."], "Butik": ["Shop", "Butikk", "Butik"], "Ex. H&M": ["E.g. H&M", "F.eks. H&M", "F.eks. H&M"], "Belopp (kr)": ["Amount (kr)", "Beløp (kr)", "Beløb (kr)"], "Kategori": ["Category", "Kategori", "Kategori"], "Välj…": ["Choose…", "Velg…", "Vælg…"], "Vilket barn gäller det?": ["Which child is it for?", "Hvilket barn gjelder det?", "Hvilket barn gælder det?"], "Vem betalade?": ["Who paid?", "Hvem betalte?", "Hvem betalte?"], "Jag": ["Me", "Jeg", "Mig"], "Mig": ["Me", "Meg", "Mig"], "Fördelning": ["Split", "Fordeling", "Fordeling"], "Hälften var": ["Half each", "Halvparten hver", "Halvdelen hver"], "Den andra betalar allt": ["The other pays everything", "Den andre betaler alt", "Den anden betaler alt"], "Delas inte": ["Not split", "Deles ikke", "Deles ikke"], "Egen procent": ["Custom percentage", "Egen prosent", "Egen procent"], "Fyll i beloppet så räknas fördelningen ut.": ["Fill in the amount and the split is calculated.", "Fyll inn beløpet, så regnes fordelingen ut.", "Udfyld beløbet, så beregnes fordelingen."], "Utgiften loggas men ingen blir skyldig något.": ["The expense is logged but nobody owes anything.", "Utgiften registreres, men ingen skylder noe.", "Udgiften registreres, men ingen skylder noget."], "Projekt (valfritt)": ["Project (optional)", "Prosjekt (valgfritt)", "Projekt (valgfrit)"], "Inget projekt": ["No project", "Ingen prosjekt", "Intet projekt"], "Garanti / reklamationsrätt": ["Warranty / right to complain", "Garanti / reklamasjonsrett", "Garanti / reklamationsret"], "Automatiskt (3 år för saker, inget för mat och tjänster)": ["Automatic (3 years for goods, none for food and services)", "Automatisk (3 år for varer, ingenting for mat og tjenester)", "Automatisk (3 år for varer, intet for mad og tjenester)"], "Ingen": ["None", "Ingen", "Ingen"], "3 år – reklamationsrätt": ["3 years – right to complain", "3 år – reklamasjonsrett", "3 år – reklamationsret"], "Spara och skicka notis": ["Save and send notification", "Lagre og send varsel", "Gem og send notifikation"], "Ta bort kvittot": ["Delete receipt", "Slett kvitteringen", "Slet kvitteringen"], "Rader på kvittot – bocka ur det som inte ska räknas med": ["Lines on the receipt – untick what shouldn't be counted", "Linjer på kvitteringen – fjern haken for det som ikke skal regnes med", "Linjer på kvitteringen – fjern fluebenet ved det, der ikke skal tælles med"], "och välj barn": ["and choose the child", "og velg barn", "og vælg barn"], "kontrollera uppgifterna": ["check the details", "kontroller opplysningene", "kontrollér oplysningerne"], "Ingen bild sparad för det här kvittot.": ["No photo saved for this receipt.", "Ingen bilde lagret for denne kvitteringen.", "Intet billede gemt for denne kvittering."], "Hämtar kvittobilden…": ["Fetching the receipt photo…", "Henter kvitteringsbildet…", "Henter kvitteringsbilledet…"], "Spara bilden på telefonen": ["Save the photo on your phone", "Lagre bildet på telefonen", "Gem billedet på telefonen"], "Kvittobilden finns inte längre.": ["The receipt photo no longer exists.", "Kvitteringsbildet finnes ikke lenger.", "Kvitteringsbilledet findes ikke længere."], "Kunde inte hämta bilden just nu. Försök igen om en stund.": ["Couldn't fetch the photo right now. Try again in a moment.", "Kunne ikke hente bildet nå. Prøv igjen om litt.", "Kunne ikke hente billedet lige nu. Prøv igen om lidt."], "Visa kvittot nedan i butiken om något går sönder.": ["Show the receipt below in the shop if something breaks.", "Vis kvitteringen nedenfor i butikken hvis noe går i stykker.", "Vis kvitteringen nedenfor i butikken, hvis noget går i stykker."], "Delas inte.": ["Not split.", "Deles ikke.", "Deles ikke."], "Registrera betalning": ["Record payment", "Registrer betaling", "Registrer betaling"], "Själva betalningen gör ni med Swish eller överföring. Här noterar ni bara att den är gjord, så att saldot stämmer.": ["You make the actual payment by Swish or bank transfer. Here you just note that it's done, so the balance is right.", "Selve betalingen gjør dere med Vipps eller overføring. Her noterer dere bare at den er gjort, så saldoen stemmer.", "Selve betalingen sker med MobilePay eller overførsel. Her noterer I bare, at den er gjort, så saldoen passer."], "Markera som betalt": ["Mark as paid", "Marker som betalt", "Markér som betalt"], "Ändra barn": ["Edit child", "Endre barn", "Ændr barn"], "Namn": ["Name", "Navn", "Navn"], "Födelsedag (valfritt)": ["Birthday (optional)", "Fødselsdag (valgfritt)", "Fødselsdag (valgfrit)"], "Barnkort – syns för er båda": ["Child card – visible to you both", "Barnekort – synlig for dere begge", "Børnekort – synligt for jer begge"], "Klädstorlek": ["Clothing size", "Klesstørrelse", "Tøjstørrelse"], "Skostorlek": ["Shoe size", "Skostørrelse", "Skostørrelse"], "Allergier": ["Allergies", "Allergier", "Allergier"], "Mediciner": ["Medicines", "Medisiner", "Medicin"], "Vårdcentral / BVC / tandvård": ["Health centre / child clinic / dentist", "Legekontor / helsestasjon / tannlege", "Lægehus / sundhedsplejerske / tandlæge"], "Skola / förskola, klass och lärare": ["School / preschool, class and teacher", "Skole / barnehage, klasse og lærer", "Skole / børnehave, klasse og lærer"], "Viktiga kontakter": ["Important contacts", "Viktige kontakter", "Vigtige kontakter"], "Övrigt att veta": ["Other things to know", "Annet å vite", "Andet at vide"], "Ex. 134/140": ["E.g. 134/140", "F.eks. 134/140", "F.eks. 134/140"], "Ex. 33": ["E.g. 33", "F.eks. 33", "F.eks. 33"], "Ex. nötter, pollen": ["E.g. nuts, pollen", "F.eks. nøtter, pollen", "F.eks. nødder, pollen"], "Ex. astmaspray vid behov": ["E.g. asthma inhaler when needed", "F.eks. astmaspray ved behov", "F.eks. astmaspray efter behov"], "Ex. mormor 070-123 45 67, fritids 08-123 45": ["E.g. grandma 070-123 45 67, after-school 08-123 45", "F.eks. mormor 070-123 45 67, SFO 08-123 45", "F.eks. mormor 070-123 45 67, SFO 08-123 45"], "Färg i kalendern": ["Colour in the calendar", "Farge i kalenderen", "Farve i kalenderen"], "Inte ifyllt": ["Not filled in", "Ikke fylt ut", "Ikke udfyldt"], "Ändra barnkortet": ["Edit the child card", "Endre barnekortet", "Ændr børnekortet"], "Kompisar": ["Friends", "Venner", "Venner"], "Inga kompisar tillagda än.": ["No friends added yet.", "Ingen venner lagt til ennå.", "Ingen venner tilføjet endnu."], "+ Lägg till kompis": ["+ Add friend", "+ Legg til venn", "+ Tilføj ven"], "Kompisens namn": ["Friend's name", "Vennens navn", "Vennens navn"], "Förälder": ["Parent", "Forelder", "Forælder"], "Ex. Johan (pappa)": ["E.g. John (dad)", "F.eks. Johan (pappa)", "F.eks. Johan (far)"], "Telefon": ["Phone", "Telefon", "Telefon"], "Bra att veta (valfritt)": ["Good to know (optional)", "Greit å vite (valgfritt)", "Godt at vide (valgfrit)"], "Ex. adress, allergier": ["E.g. address, allergies", "F.eks. adresse, allergier", "F.eks. adresse, allergier"], "Spara kompis": ["Save friend", "Lagre venn", "Gem ven"], "inget nummer": ["no number", "ikke noe nummer", "intet nummer"], "Numret är kopierat": ["Number copied", "Nummeret er kopiert", "Nummeret er kopieret"], "Boendeschema": ["Living schedule", "Bostedsplan", "Samværsplan"], "Fyller i var barnen bor framåt. Enstaka dagar ändrar ni med Be om byte.": ["Fills in where the children live going forward. Change single days with Ask to swap.", "Fyller ut hvor barna bor fremover. Enkeltdager endrer dere med Be om bytte.", "Udfylder, hvor børnene bor fremover. Enkelte dage ændrer I med Bed om bytte."], "Hur bor barnen?": ["How do the children live?", "Hvordan bor barna?", "Hvordan bor børnene?"], "Vecka-vecka": ["Week on, week off", "Uke-uke", "Uge-uge"], "Varannan helg (fre–sön)": ["Every other weekend (Fri–Sun)", "Annenhver helg (fre–søn)", "Hver anden weekend (fre–søn)"], "Första dagen i schemat": ["First day of the schedule", "Første dag i planen", "Første dag i skemaet"], "Barnen börjar hos": ["The children start with", "Barna begynner hos", "Børnene starter hos"], "De första två veckorna:": ["The first two weeks:", "De to første ukene:", "De første to uger:"], "Spara schemat": ["Save schedule", "Lagre planen", "Gem skemaet"], "Ta bort schemat": ["Delete schedule", "Slett planen", "Slet skemaet"], "Från": ["From", "Fra", "Fra"], "Till och med": ["Up to and including", "Til og med", "Til og med"], "Barnen ska vara hos": ["The children should be with", "Barna skal være hos", "Børnene skal være hos"], "Meddelande (valfritt)": ["Message (optional)", "Melding (valgfritt)", "Besked (valgfrit)"], "Ex. jag har en kurs den kvällen": ["E.g. I have a class that evening", "F.eks. jeg har et kurs den kvelden", "F.eks. jeg har et kursus den aften"], "Vilket lov?": ["Which holiday?", "Hvilken ferie?", "Hvilken ferie?"], "Ex. Kalas hos mormor": ["E.g. Party at grandma's", "F.eks. Selskap hos mormor", "F.eks. Fest hos mormor"], "Kommentar (valfritt)": ["Comment (optional)", "Kommentar (valgfritt)", "Kommentar (valgfrit)"], "Ex. vi åker till fjällen": ["E.g. we're going to the mountains", "F.eks. vi drar til fjellet", "F.eks. vi tager til bjergene"], "Visas för hen inför bytet": ["Shown to them before the changeover", "Vises for vedkommende før byttet", "Vises for vedkommende før skiftet"], "Har haft feber": ["Has had a fever", "Har hatt feber", "Har haft feber"], "Har fått medicin kl": ["Has had medicine at", "Har fått medisin kl", "Har fået medicin kl"], "Har läxa till": ["Has homework for", "Har lekser til", "Har lektier til"], "Har glömt": ["Has forgotten", "Har glemt", "Har glemt"], "Har sovit dåligt": ["Has slept badly", "Har sovet dårlig", "Har sovet dårligt"], "Har ont i": ["Has a sore", "Har vondt i", "Har ondt i"], "Har varit glad och pigg": ["Has been happy and lively", "Har vært glad og opplagt", "Har været glad og frisk"], "Meddelande": ["Message", "Melding", "Besked"], "Gäller bytet": ["For the changeover on", "Gjelder byttet", "Gælder skiftet"], "Skicka hälsningen": ["Send message", "Send hilsenen", "Send hilsenen"], "Hur ofta?": ["How often?", "Hvor ofte?", "Hvor tit?"], "Nästa gång": ["Next time", "Neste gang", "Næste gang"], "Vad ska göras?": ["What needs doing?", "Hva skal gjøres?", "Hvad skal gøres?"], "Ex. Dammsuga": ["E.g. Vacuum", "F.eks. Støvsuge", "F.eks. Støvsuge"], "Vilka turas om? (i den ordningen)": ["Who takes turns? (in that order)", "Hvem bytter på? (i den rekkefølgen)", "Hvem skiftes? (i den rækkefølge)"], "Lägg in dina barn under Mina barn så kan de vara med i turordningen.": ["Add your children under My children and they can join the rota.", "Legg inn barna dine under Mine barn, så kan de være med i turen.", "Tilføj dine børn under Mine børn, så kan de være med i turen."], "Ta bort sysslan": ["Delete chore", "Slett oppgaven", "Slet pligten"], "Ändra syssla": ["Edit chore", "Endre oppgave", "Ændr pligt"], "Varje dag": ["Every day", "Hver dag", "Hver dag"], "Varannan dag": ["Every other day", "Annenhver dag", "Hver anden dag"], "Var tredje dag": ["Every third day", "Hver tredje dag", "Hver tredje dag"], "Varje vecka": ["Every week", "Hver uke", "Hver uge"], "Varannan vecka": ["Every other week", "Annenhver uke", "Hver anden uge"], "Varje månad": ["Every month", "Hver måned", "Hver måned"], "varje dag": ["every day", "hver dag", "hver dag"], "var tredje dag": ["every third day", "hver tredje dag", "hver tredje dag"], "varannan dag": ["every other day", "annenhver dag", "hver anden dag"], "varje vecka": ["every week", "hver uke", "hver uge"], "varannan vecka": ["every other week", "annenhver uke", "hver anden uge"], "varje månad": ["every month", "hver måned", "hver måned"], "försenad": ["overdue", "forsinket", "forsinket"], "Nytt sparmål": ["New savings goal", "Nytt sparemål", "Nyt sparemål"], "Ändra sparmål": ["Edit savings goal", "Endre sparemål", "Ændr sparemål"], "Vad sparar du till?": ["What are you saving for?", "Hva sparer du til?", "Hvad sparer du op til?"], "Ex. Resa, buffert, ny soffa": ["E.g. Trip, buffer, new sofa", "F.eks. Reise, buffer, ny sofa", "F.eks. Rejse, buffer, ny sofa"], "Mål (kr)": ["Goal (kr)", "Mål (kr)", "Mål (kr)"], "Redan sparat (kr)": ["Already saved (kr)", "Allerede spart (kr)", "Allerede sparet (kr)"], "Klart till (valfritt)": ["Done by (optional)", "Ferdig til (valgfritt)", "Færdig til (valgfrit)"], "Ta bort sparmålet": ["Delete savings goal", "Slett sparemålet", "Slet sparemålet"], "Ex. 1000": ["E.g. 1000", "F.eks. 1000", "F.eks. 1000"], "Insättning": ["Deposit", "Innskudd", "Indbetaling"], "Uttag": ["Withdrawal", "Uttak", "Hævning"], "Ny fast kostnad": ["New fixed cost", "Ny fast kostnad", "Ny fast udgift"], "Ändra fast kostnad": ["Edit fixed cost", "Endre fast kostnad", "Ændr fast udgift"], "Läggs in i budgeten automatiskt varje månad": ["Added to the budget automatically every month", "Legges inn i budsjettet automatisk hver måned", "Lægges automatisk ind i budgettet hver måned"], "per månad": ["per month", "per måned", "om måneden"], "Ex. hyra, el, försäkringar, Netflix eller underhållsbidrag.": ["E.g. rent, electricity, insurance, Netflix or child support.", "F.eks. husleie, strøm, forsikringer, Netflix eller barnebidrag.", "F.eks. husleje, el, forsikringer, Netflix eller børnebidrag."], "Vad?": ["What?", "Hva?", "Hvad?"], "Ex. Hyra": ["E.g. Rent", "F.eks. Husleie", "F.eks. Husleje"], "Belopp per månad (kr)": ["Amount per month (kr)", "Beløp per måned (kr)", "Beløb om måneden (kr)"], "Dag i månaden": ["Day of the month", "Dag i måneden", "Dag i måneden"], "Från månad": ["From month", "Fra måned", "Fra måned"], "Till månad (valfritt)": ["To month (optional)", "Til måned (valgfritt)", "Til måned (valgfrit)"], "Ta bort": ["Delete", "Slett", "Slet"], "Vill du bara sluta betala? Fyll i \"Till månad\" så finns historiken kvar i budgeten.": ["Just want to stop paying? Fill in \"To month\" and the history stays in the budget.", "Vil du bare slutte å betale? Fyll inn «Til måned», så blir historikken værende i budsjettet.", "Vil du bare stoppe med at betale? Udfyld \"Til måned\", så bliver historikken i budgettet."], "kr/mån": ["kr/month", "kr/mnd", "kr/md."], "fast kostnad": ["fixed cost", "fast kostnad", "fast udgift"], "Månadsbudget": ["Monthly budget", "Månedsbudsjett", "Månedsbudget"], "Lämna tomt för kategorier utan budget": ["Leave empty for categories without a budget", "La stå tomt for kategorier uten budsjett", "Lad stå tomt for kategorier uden budget"], "Spara budget": ["Save budget", "Lagre budsjett", "Gem budget"], "Ändra projekt": ["Edit project", "Endre prosjekt", "Ændr projekt"], "Ex. Nytt kök": ["E.g. New kitchen", "F.eks. Nytt kjøkken", "F.eks. Nyt køkken"], "Budget (kr)": ["Budget (kr)", "Budsjett (kr)", "Budget (kr)"], "Start": ["Start", "Start", "Start"], "Projektet är klart": ["The project is done", "Prosjektet er ferdig", "Projektet er færdigt"], "Ta bort projektet": ["Delete project", "Slett prosjektet", "Slet projektet"], "Kvittona finns kvar i budgeten om du tar bort projektet.": ["The receipts stay in the budget if you delete the project.", "Kvitteringene blir værende i budsjettet hvis du sletter prosjektet.", "Kvitteringerne bliver i budgettet, hvis du sletter projektet."], "Lägg till kvitto": ["Add receipt", "Legg til kvittering", "Tilføj kvittering"], "Används i dina listor och din budget. Bara du ser dem.": ["Used in your lists and your budget. Only you see them.", "Brukes i listene og budsjettet ditt. Bare du ser dem.", "Bruges i dine lister og dit budget. Kun du ser dem."], "Barnets namn": ["Child's name", "Barnets navn", "Barnets navn"], "Vad vill du ha tips på?": ["What would you like ideas for?", "Hva vil du ha tips om?", "Hvad vil du have idéer til?"], "5 enkla vardagsrätter": ["5 easy weekday dinners", "5 enkle hverdagsretter", "5 nemme hverdagsretter"], "Barnvänligt": ["Child-friendly", "Barnevennlig", "Børnevenligt"], "Vegetariskt": ["Vegetarian", "Vegetarisk", "Vegetarisk"], "Under 30 minuter": ["Under 30 minutes", "Under 30 minutter", "Under 30 minutter"], "Billigt": ["Cheap", "Billig", "Billigt"], "Matlådevänligt": ["Good for lunchboxes", "Matpakkevennlig", "Madpakkevenligt"], "Fisk": ["Fish", "Fisk", "Fisk"], "Antal portioner": ["Servings", "Antall porsjoner", "Antal portioner"], "Ge mig förslag": ["Give me ideas", "Gi meg forslag", "Giv mig forslag"], "Tänker ut middagar…": ["Thinking up dinners…", "Tenker ut middager…", "Finder på aftensmad…"], "Hämtar förslag…": ["Fetching ideas…", "Henter forslag…", "Henter forslag…"], "finns oftast hemma": ["usually at home", "finnes som regel hjemme", "har man som regel hjemme"], "står redan på listan": ["already on the list", "står allerede på listen", "står allerede på listen"], "Lägg in i inköpslistan": ["Add to shopping list", "Legg på handlelisten", "Læg på indkøbslisten"], "Lägg in igen": ["Add again", "Legg inn igjen", "Læg ind igen"], "Inlagd på inköpslistan": ["Added to the shopping list", "Lagt på handlelisten", "Lagt på indkøbslisten"], "Allt fanns redan på listan": ["Everything was already on the list", "Alt var allerede på listen", "Alt var allerede på listen"], "AI är inte tillgänglig här, så här är några vanliga förslag.": ["AI isn't available here, so here are some common ideas.", "AI er ikke tilgjengelig her, så her er noen vanlige forslag.", "AI er ikke tilgængelig her, så her er nogle almindelige forslag."], "AI:n svarade inte, så här är några vanliga förslag i stället.": ["The AI didn't answer, so here are some common ideas instead.", "AI-en svarte ikke, så her er noen vanlige forslag i stedet.", "AI'en svarede ikke, så her er nogle almindelige forslag i stedet."], "AI:n är upptagen just nu, så här är några vanliga förslag i stället.": ["The AI is busy right now, so here are some common ideas instead.", "AI-en er opptatt akkurat nå, så her er noen vanlige forslag i stedet.", "AI'en er optaget lige nu, så her er nogle almindelige forslag i stedet."], "AI-tips är inte tillåtet, så här är några vanliga förslag i stället.": ["AI ideas aren't allowed, so here are some common ideas instead.", "AI-tips er ikke tillatt, så her er noen vanlige forslag i stedet.", "AI-idéer er ikke tilladt, så her er nogle almindelige forslag i stedet."], "Förstår vad du menar…": ["Working out what you mean…", "Forstår hva du mener…", "Forstår, hvad du mener…"], "Lägger till…": ["Adding…", "Legger til…", "Tilføjer…"], "Läser in…": ["Reading…", "Leser inn…", "Læser…"], "Lägger in…": ["Adding…", "Legger inn…", "Tilføjer…"], "Jag förstod inte vad som skulle läggas till. Prova t.ex. \"mjölk på inköpslistan\".": ["I didn't understand what to add. Try e.g. \"milk on the shopping list\".", "Jeg forsto ikke hva som skulle legges til. Prøv f.eks. «melk på handlelisten».", "Jeg forstod ikke, hvad der skulle tilføjes. Prøv f.eks. \"mælk på indkøbslisten\"."], "Jag hittade inget datum. Skriv t.ex. \"den 15 oktober\", \"i morgon\" eller \"på fredag\".": ["I didn't find a date. Write e.g. \"15 October\", \"tomorrow\" or \"on Friday\".", "Jeg fant ingen dato. Skriv f.eks. «15. oktober», «i morgen» eller «på fredag».", "Jeg fandt ingen dato. Skriv f.eks. \"15. oktober\", \"i morgen\" eller \"på fredag\"."], "Visa listor": ["Show lists", "Vis lister", "Vis lister"], "Visa kalendern": ["Show calendar", "Vis kalenderen", "Vis kalenderen"], "Klart! Appen är anpassad efter dig.": ["Done! The app is adapted to you.", "Ferdig! Appen er tilpasset deg.", "Færdig! Appen er tilpasset dig."], "Sparat": ["Saved", "Lagret", "Gemt"], "Sparat – syns i budgeten": ["Saved – shows in the budget", "Lagret – vises i budsjettet", "Gemt – vises i budgettet"], "Borttaget": ["Deleted", "Slettet", "Slettet"], "Ändringen är sparad": ["Change saved", "Endringen er lagret", "Ændringen er gemt"], "Händelsen är tillagd": ["Event added", "Hendelsen er lagt til", "Begivenheden er tilføjet"], "Kvittot är sparat": ["Receipt saved", "Kvitteringen er lagret", "Kvitteringen er gemt"], "Betalningen är noterad": ["Payment recorded", "Betalingen er registrert", "Betalingen er registreret"], "Budgeten är sparad": ["Budget saved", "Budsjettet er lagret", "Budgettet er gemt"], "Projektet är sparat": ["Project saved", "Prosjektet er lagret", "Projektet er gemt"], "Sparmålet är sparat": ["Savings goal saved", "Sparemålet er lagret", "Sparemålet er gemt"], "Sysslan är sparad": ["Chore saved", "Oppgaven er lagret", "Pligten er gemt"], "Schemat är sparat": ["Schedule saved", "Planen er lagret", "Skemaet er gemt"], "Schemat är borttaget": ["Schedule deleted", "Planen er slettet", "Skemaet er slettet"], "Förfrågan borttagen": ["Request deleted", "Forespørselen er slettet", "Anmodningen er slettet"], "Avbockade rader borttagna": ["Checked lines removed", "Avkryssede linjer fjernet", "Afkrydsede linjer fjernet"], "Packlistan är nollställd inför nästa byte": ["Packing list reset for the next changeover", "Pakkelisten er nullstilt før neste bytte", "Pakkelisten er nulstillet før næste skift"], "Fyll i ett belopp": ["Fill in an amount", "Fyll inn et beløp", "Udfyld et beløb"], "Fyll i ett mål": ["Fill in a goal", "Fyll inn et mål", "Udfyld et mål"], "Välj minst en person": ["Choose at least one person", "Velg minst én person", "Vælg mindst én person"], "Välj högst 31 dagar åt gången": ["Choose at most 31 days at a time", "Velg maks 31 dager om gangen", "Vælg højst 31 dage ad gangen"], "Välj högst 10 veckor åt gången": ["Choose at most 10 weeks at a time", "Velg maks 10 uker om gangen", "Vælg højst 10 uger ad gangen"], "Du har tackat nej": ["You've declined", "Du har takket nei", "Du har takket nej"], "Du saknar behörighet att spara": ["You don't have permission to save", "Du mangler tillatelse til å lagre", "Du har ikke tilladelse til at gemme"], "Kunde inte spara. Försök igen.": ["Couldn't save. Try again.", "Kunne ikke lagre. Prøv igjen.", "Kunne ikke gemme. Prøv igen."], "Lagringen är full – ta bort gamla poster": ["Storage is full – delete old entries", "Lagringen er full – slett gamle oppføringer", "Lagringen er fuld – slet gamle poster"], "Bilden kunde inte sparas, men uppgifterna sparas.": ["The photo couldn't be saved, but the details are saved.", "Bildet kunne ikke lagres, men opplysningene lagres.", "Billedet kunne ikke gemmes, men oplysningerne gemmes."], "Notiserna visas när du öppnar appen. Riktiga push-notiser till telefonen kräver en installerad app.": ["Notifications show when you open the app. Real push notifications to your phone need an installed app.", "Varslene vises når du åpner appen. Ekte push-varsler til telefonen krever en installert app.", "Notifikationerne vises, når du åbner appen. Rigtige push-notifikationer til telefonen kræver en installeret app."], "Nästa": ["Next", "Neste", "Næste"], "Föregående": ["Previous", "Forrige", "Forrige"], "Nästa månad": ["Next month", "Neste måned", "Næste måned"], "Föregående månad": ["Previous month", "Forrige måned", "Forrige måned"], "Kläder": ["Clothes", "Klær", "Tøj"], "Skor": ["Shoes", "Sko", "Sko"], "Aktiviteter & avgifter": ["Activities & fees", "Aktiviteter og avgifter", "Aktiviteter og gebyrer"], "Skola & förskola": ["School & preschool", "Skole og barnehage", "Skole og børnehave"], "Hälsa & tandvård": ["Health & dental", "Helse og tannhelse", "Sundhed og tandpleje"], "Leksaker & presenter": ["Toys & presents", "Leker og gaver", "Legetøj og gaver"], "Mat & fika": ["Food & snacks", "Mat og kos", "Mad og snacks"], "Övrigt": ["Other", "Annet", "Andet"], "Hyra & boende": ["Rent & housing", "Husleie og bolig", "Husleje og bolig"], "Mat & hushåll": ["Food & household", "Mat og husholdning", "Mad og husholdning"], "El & värme": ["Electricity & heating", "Strøm og oppvarming", "El og varme"], "Bredband & abonnemang": ["Broadband & subscriptions", "Bredbånd og abonnementer", "Bredbånd og abonnementer"], "Hem & inredning": ["Home & furnishing", "Hjem og interiør", "Hjem og indretning"], "Resor & nöje": ["Travel & leisure", "Reiser og fritid", "Rejser og fritid"], "Barnkläder & skor": ["Children's clothes & shoes", "Barneklær og sko", "Børnetøj og sko"], "Barnens aktiviteter": ["Children's activities", "Barnas aktiviteter", "Børnenes aktiviteter"], "Hälsa": ["Health", "Helse", "Sundhed"], "Mat": ["Food", "Mat", "Mad"], "Boende": ["Housing", "Bolig", "Bolig"], "Hem": ["Home", "Hjem", "Hjem"], "Renovering": ["Renovation", "Oppussing", "Renovering"], "Barn": ["Children", "Barn", "Børn"], "Underhållsbidrag": ["Child support", "Barnebidrag", "Børnebidrag"], "Transport": ["Transport", "Transport", "Transport"], "Nöje & restaurang": ["Leisure & restaurants", "Fritid og restaurant", "Fritid og restaurant"], "Försäkringar": ["Insurance", "Forsikringer", "Forsikringer"], "Abonnemang": ["Subscriptions", "Abonnementer", "Abonnementer"], "Leker hos Saga": ["Playdate at Saga's", "Leker hos Saga", "Leger hos Saga"], "Fotbollsträning": ["Football practice", "Fotballtrening", "Fodboldtræning"], "Simskola": ["Swimming lessons", "Svømmeskole", "Svømmeskole"], "Tandläkare": ["Dentist", "Tannlege", "Tandlæge"], "Padel med Johan": ["Padel with Johan", "Padel med Johan", "Padel med Johan"], "Läkartid": ["Doctor's appointment", "Legetime", "Lægetid"], "Badrumsrenovering": ["Bathroom renovation", "Oppussing av bad", "Badeværelsesrenovering"], "Resa till Kreta": ["Trip to Crete", "Reise til Kreta", "Rejse til Kreta"], "Dammsuga": ["Vacuum", "Støvsuge", "Støvsuge"], "Tömma diskmaskinen": ["Empty the dishwasher", "Tømme oppvaskmaskinen", "Tømme opvaskemaskinen"], "Byta lakan": ["Change the sheets", "Skifte sengetøy", "Skifte sengetøj"], "Duka av efter middagen": ["Clear the table after dinner", "Rydde av bordet etter middag", "Rydde af efter aftensmaden"], "Sopor och återvinning": ["Rubbish and recycling", "Søppel og resirkulering", "Skrald og genbrug"], "Hyra": ["Rent", "Husleie", "Husleje"], "Hemförsäkring": ["Home insurance", "Innboforsikring", "Indboforsikring"], "Gympapåse": ["PE bag", "Gymbag", "Idrætstaske"], "Laddare till surfplattan": ["Tablet charger", "Lader til nettbrettet", "Oplader til tablet"], "Gosedjuret Nalle": ["Teddy the cuddly toy", "Kosedyret Bamse", "Tøjdyret Bamse"], "Läxböcker": ["Homework books", "Leksebøker", "Lektiebøger"], "Mjölk": ["Milk", "Melk", "Mælk"], "Kaffe": ["Coffee", "Kaffe", "Kaffe"], "Ny vinterjacka": ["New winter jacket", "Ny vinterjakke", "Ny vinterjakke"], "Anmäla Noah till simskolan": ["Sign Noah up for swimming lessons", "Melde Noah på svømmeskole", "Tilmelde Noah svømmeskole"], "Byta vinterdäck": ["Change to winter tyres", "Bytte til vinterdekk", "Skifte til vinterdæk"], "Toapapper": ["Toilet paper", "Dopapir", "Toiletpapir"], "Diskmedel": ["Washing-up liquid", "Oppvaskmiddel", "Opvaskemiddel"], "Tvättmedel": ["Laundry detergent", "Vaskemiddel", "Vaskemiddel"], "Glödlampor till hallen": ["Light bulbs for the hall", "Lyspærer til gangen", "Pærer til entréen"], "Hämta IKEA-beställningen": ["Collect the IKEA order", "Hente IKEA-bestillingen", "Hente IKEA-bestillingen"], "Middag hos Robins föräldrar": ["Dinner at Robin's parents", "Middag hos Robins foreldre", "Middag hos Robins forældre"], "Bio": ["Cinema", "Kino", "Biograf"], "Hyra oktober": ["Rent October", "Husleie oktober", "Husleje oktober"], "Noah har varit lite förkyld, fick Alvedon kl 14. Ella har läxa till torsdag (glosor).": ["Noah has had a bit of a cold, had paracetamol at 2 pm. Ella has homework for Thursday (vocabulary).", "Noah har vært litt forkjølet, fikk Paracet kl 14. Ella har lekser til torsdag (gloser).", "Noah har været lidt forkølet, fik Panodil kl 14. Ella har lektier til torsdag (gloser)."], "Jag har en kurs den kvällen.": ["I have a class that evening.", "Jeg har et kurs den kvelden.", "Jeg har et kursus den aften."], "Mamma lade in Stadium 899 kr för Noah. Din del: 450 kr.": ["Mum added Stadium 899 kr for Noah. Your share: 450 kr.", "Mamma la inn Stadium 899 kr for Noah. Din del: 450 kr.", "Mor tilføjede Stadium 899 kr for Noah. Din del: 450 kr."], "Bor på Tallvägen 4": ["Lives at Tallvägen 4", "Bor i Tallvägen 4", "Bor på Tallvägen 4"], "Nötter": ["Nuts", "Nøtter", "Nødder"], "Exempelförslag": ["Example ideas", "Eksempelforslag", "Eksempelforslag"], "Barnen är hos": ["The children are with", "Barna er hos", "Børnene er hos"], "dig": ["you", "deg", "dig"], "Ex. Noah har varit förkyld, fick Alvedon kl 14. Ella har läxa till torsdag.": ["E.g. Noah has had a cold, had paracetamol at 2 pm. Ella has homework for Thursday.", "F.eks. Noah har vært forkjølet, fikk Paracet kl 14. Ella har lekser til torsdag.", "F.eks. Noah har været forkølet, fik Panodil kl 14. Ella har lektier til torsdag."], "Köttfärssås med spaghetti": ["Spaghetti bolognese", "Kjøttdeigsaus med spagetti", "Kødsovs med spaghetti"], "Klassiker som alla barn gillar.": ["A classic all kids like.", "En klassiker alle barn liker.", "En klassiker, alle børn kan lide."], "Krämig kycklinggryta med ris": ["Creamy chicken stew with rice", "Kremet kyllinggryte med ris", "Cremet kyllingegryde med ris"], "En gryta som går snabbt en vardag.": ["A stew that's quick on a weekday.", "En gryte som går fort på en hverdag.", "En gryde, der går hurtigt på en hverdag."], "Fiskpinnar med potatismos": ["Fish fingers with mashed potatoes", "Fiskepinner med potetmos", "Fiskepinde med kartoffelmos"], "Snabbt, enkelt och barnvänligt.": ["Quick, easy and child-friendly.", "Raskt, enkelt og barnevennlig.", "Hurtigt, nemt og børnevenligt."], "Tacos": ["Tacos", "Taco", "Tacos"], "Fredagsmys eller en enkel vardag.": ["Friday treat or an easy weekday.", "Fredagskos eller en enkel hverdag.", "Fredagshygge eller en nem hverdag."], "Linsgryta med kokos": ["Lentil stew with coconut", "Linsegryte med kokos", "Linsegryde med kokos"], "Vegetariskt, billigt och mättande.": ["Vegetarian, cheap and filling.", "Vegetarisk, billig og mettende.", "Vegetarisk, billigt og mættende."], "Laxpasta med spenat": ["Salmon pasta with spinach", "Laksepasta med spinat", "Laksepasta med spinat"], "Färdig på 20 minuter.": ["Ready in 20 minutes.", "Ferdig på 20 minutter.", "Klar på 20 minutter."], "Pannkakor med sylt": ["Pancakes with jam", "Pannekaker med syltetøy", "Pandekager med syltetøj"], "Torsdagsklassikern.": ["The Thursday classic.", "Torsdagsklassikeren.", "Torsdagsklassikeren."], "Halloumiwraps": ["Halloumi wraps", "Halloumi-wraps", "Halloumi-wraps"], "Vegetariskt och snabbt.": ["Vegetarian and quick.", "Vegetarisk og raskt.", "Vegetarisk og hurtigt."], "Köttfärs": ["Minced beef", "Kjøttdeig", "Hakket oksekød"], "Krossade tomater": ["Chopped tomatoes", "Hakkede tomater", "Hakkede tomater"], "Gul lök": ["Onion", "Gul løk", "Løg"], "Vitlök": ["Garlic", "Hvitløk", "Hvidløg"], "Spaghetti": ["Spaghetti", "Spagetti", "Spaghetti"], "Riven ost": ["Grated cheese", "Revet ost", "Revet ost"], "Salt och peppar": ["Salt and pepper", "Salt og pepper", "Salt og peber"], "Olja": ["Oil", "Olje", "Olie"], "Kycklingfilé": ["Chicken breast", "Kyllingfilet", "Kyllingebryst"], "Matlagningsgrädde": ["Cooking cream", "Matfløte", "Madlavningsfløde"], "Paprika": ["Pepper (bell)", "Paprika", "Peberfrugt"], "Ris": ["Rice", "Ris", "Ris"], "Buljongtärning": ["Stock cube", "Buljongterning", "Bouillonterning"], "Fiskpinnar": ["Fish fingers", "Fiskepinner", "Fiskepinde"], "Potatis": ["Potatoes", "Poteter", "Kartofler"], "Smör": ["Butter", "Smør", "Smør"], "Ärtor": ["Peas", "Erter", "Ærter"], "Remouladsås": ["Remoulade", "Remulade", "Remoulade"], "Tacokrydda": ["Taco seasoning", "Tacokrydder", "Tacokrydderi"], "Tortillabröd": ["Tortillas", "Tortillalefser", "Tortillas"], "Gurka": ["Cucumber", "Agurk", "Agurk"], "Tomat": ["Tomatoes", "Tomat", "Tomat"], "Majs": ["Sweetcorn", "Mais", "Majs"], "Tacosås": ["Taco sauce", "Tacosaus", "Tacosauce"], "Röda linser": ["Red lentils", "Røde linser", "Røde linser"], "Kokosmjölk": ["Coconut milk", "Kokosmelk", "Kokosmælk"], "Curry": ["Curry", "Karri", "Karry"], "Laxfilé": ["Salmon fillet", "Laksefilet", "Laksefilet"], "Pasta": ["Pasta", "Pasta", "Pasta"], "Bladspenat": ["Baby spinach", "Bladspinat", "Bladspinat"], "Citron": ["Lemon", "Sitron", "Citron"], "Vetemjöl": ["Flour", "Hvetemel", "Hvedemel"], "Ägg": ["Eggs", "Egg", "Æg"], "Sylt": ["Jam", "Syltetøy", "Syltetøj"], "Halloumi": ["Halloumi", "Halloumi", "Halloumi"], "Sallad": ["Lettuce", "Salat", "Salat"], "Tzatziki": ["Tzatziki", "Tzatziki", "Tzatziki"], "Tröja": ["Sweater", "Genser", "Trøje"], "du": ["you", "deg", "dig"], "Du": ["You", "Du", "Du"], "mig": ["me", "meg", "mig"], "Logga in": ["Sign in", "Logg inn", "Log ind"], "Skapa konto": ["Create account", "Opprett konto", "Opret konto"], "E-post": ["Email", "E-post", "E-mail"], "Lösenord": ["Password", "Passord", "Adgangskode"], "Lösenord (minst 10 tecken)": ["Password (at least 10 characters)", "Passord (minst 10 tegn)", "Adgangskode (mindst 10 tegn)"], "Upprepa lösenordet": ["Repeat the password", "Gjenta passordet", "Gentag adgangskoden"], "Glömt lösenord?": ["Forgot password?", "Glemt passord?", "Glemt adgangskode?"], "Glömt lösenord": ["Forgot password", "Glemt passord", "Glemt adgangskode"], "Vi skickar en länk till din e-post. Länken gäller en kort stund.": ["We'll send a link to your email. The link is valid for a short time.", "Vi sender en lenke til e-posten din. Lenken gjelder en kort stund.", "Vi sender et link til din e-mail. Linket gælder kort tid."], "Skicka länk": ["Send link", "Send lenke", "Send link"], "Tillbaka till inloggning": ["Back to sign in", "Tilbake til innlogging", "Tilbage til log ind"], "Välj ett nytt lösenord": ["Choose a new password", "Velg et nytt passord", "Vælg en ny adgangskode"], "Nytt lösenord (minst 10 tecken)": ["New password (at least 10 characters)", "Nytt passord (minst 10 tegn)", "Ny adgangskode (mindst 10 tegn)"], "Spara lösenordet": ["Save password", "Lagre passordet", "Gem adgangskoden"], "Kalender, kvitton och listor för familjen – och en privat del bara för dig.": ["Calendar, receipts and lists for the family – and a private part just for you.", "Kalender, kvitteringer og lister for familien – og en privat del bare for deg.", "Kalender, kvitteringer og lister til familien – og en privat del kun til dig."], "Du har fått en inbjudan. Skapa ett konto eller logga in, så kommer du med direkt.": ["You've been invited. Create an account or sign in and you'll join straight away.", "Du har fått en invitasjon. Opprett en konto eller logg inn, så blir du med med en gang.", "Du har fået en invitation. Opret en konto eller log ind, så kommer du med med det samme."], "Appen är inte kopplad till någon databas än. Fyll i": ["The app isn't connected to a database yet. Fill in", "Appen er ikke koblet til en database ennå. Fyll inn", "Appen er ikke forbundet til en database endnu. Udfyld"], "enligt instruktionerna i README.": ["as described in the README.", "som beskrevet i README.", "som beskrevet i README."], "Appen är inte kopplad till någon databas än.": ["The app isn't connected to a database yet.", "Appen er ikke koblet til en database ennå.", "Appen er ikke forbundet til en database endnu."], "Titta runt med exempeldata": ["Look around with example data", "Se deg rundt med eksempeldata", "Kig rundt med eksempeldata"], "Det du lägger under Mitt ser bara du. Allt sparas krypterat i Europa.": ["Only you see what you put under Mine. Everything is stored encrypted in Europe.", "Bare du ser det du legger under Mitt. Alt lagres kryptert i Europa.", "Kun du ser det, du lægger under Mit. Alt gemmes krypteret i Europa."], "Fel e-post eller lösenord.": ["Wrong email or password.", "Feil e-post eller passord.", "Forkert e-mail eller adgangskode."], "Bekräfta din e-post först. Kolla inkorgen och klicka på länken.": ["Confirm your email first. Check your inbox and click the link.", "Bekreft e-posten din først. Sjekk innboksen og klikk på lenken.", "Bekræft din e-mail først. Tjek indbakken og klik på linket."], "Det finns redan ett konto med den e-posten. Logga in i stället.": ["There's already an account with that email. Sign in instead.", "Det finnes allerede en konto med den e-posten. Logg inn i stedet.", "Der findes allerede en konto med den e-mail. Log ind i stedet."], "Lösenordet är för svagt. Använd minst 10 tecken.": ["The password is too weak. Use at least 10 characters.", "Passordet er for svakt. Bruk minst 10 tegn.", "Adgangskoden er for svag. Brug mindst 10 tegn."], "För många försök. Vänta en stund och försök igen.": ["Too many attempts. Wait a moment and try again.", "For mange forsøk. Vent litt og prøv igjen.", "For mange forsøg. Vent lidt og prøv igen."], "Ingen kontakt med servern. Kontrollera internetanslutningen.": ["No contact with the server. Check your internet connection.", "Ingen kontakt med serveren. Sjekk internettforbindelsen.", "Ingen kontakt med serveren. Tjek internetforbindelsen."], "Något gick fel. Försök igen.": ["Something went wrong. Try again.", "Noe gikk galt. Prøv igjen.", "Noget gik galt. Prøv igen."], "Lösenorden är inte likadana.": ["The passwords don't match.", "Passordene er ikke like.", "Adgangskoderne er ikke ens."], "Lösenordet måste ha minst 10 tecken.": ["The password must be at least 10 characters.", "Passordet må ha minst 10 tegn.", "Adgangskoden skal have mindst 10 tegn."], "Om e-posten finns hos oss har vi skickat en länk. Kolla inkorgen.": ["If the email is registered with us, we've sent a link. Check your inbox.", "Hvis e-posten finnes hos oss, har vi sendt en lenke. Sjekk innboksen.", "Hvis e-mailen findes hos os, har vi sendt et link. Tjek indbakken."], "Du tittar runt utan konto, och inget sparas.": ["You're looking around without an account, and nothing is saved.", "Du ser deg rundt uten konto, og ingenting lagres.", "Du kigger rundt uden konto, og intet gemmes."], "Logga in eller skapa konto": ["Sign in or create account", "Logg inn eller opprett konto", "Log ind eller opret konto"], "Konto": ["Account", "Konto", "Konto"], "Inloggad som": ["Signed in as", "Logget inn som", "Logget ind som"], "Logga ut": ["Sign out", "Logg ut", "Log ud"], "Skapa inbjudningslänk": ["Create invite link", "Lag invitasjonslenke", "Opret invitationslink"], "Du får en länk som du skickar med sms eller mejl. Den som öppnar länken och skapar ett konto kommer med här, och bara här. Länken gäller i 14 dagar och kan användas en gång.": ["You get a link to send by text or email. Whoever opens it and creates an account joins here, and only here. The link is valid for 14 days and can be used once.", "Du får en lenke som du sender på sms eller e-post. Den som åpner lenken og oppretter en konto, blir med her og bare her. Lenken gjelder i 14 dager og kan brukes én gang.", "Du får et link, som du sender på sms eller e-mail. Den, der åbner linket og opretter en konto, kommer med her og kun her. Linket gælder i 14 dage og kan bruges én gang."], "Skapar länken…": ["Creating the link…", "Lager lenken…", "Opretter linket…"], "Skickas med sms, mejl eller annan app": ["Send by text, email or another app", "Sendes på sms, e-post eller en annen app", "Sendes på sms, e-mail eller en anden app"], "Dela länken": ["Share link", "Del lenken", "Del linket"], "Kopiera länken": ["Copy link", "Kopier lenken", "Kopiér linket"], "Länken är kopierad": ["Link copied", "Lenken er kopiert", "Linket er kopieret"], "Kunde inte skapa länken. Kontrollera internetanslutningen och försök igen.": ["Couldn't create the link. Check your internet connection and try again.", "Kunne ikke lage lenken. Sjekk internettforbindelsen og prøv igjen.", "Kunne ikke oprette linket. Tjek internetforbindelsen og prøv igen."], "Inbjudningar fungerar när du är inloggad": ["Invites work when you're signed in", "Invitasjoner fungerer når du er logget inn", "Invitationer virker, når du er logget ind"], "Kunde inte öppna Hemmet. Försök igen.": ["Couldn't open Home. Try again.", "Kunne ikke åpne Hjemmet. Prøv igjen.", "Kunne ikke åbne Hjemmet. Prøv igen."], "Bjud in din partner": ["Invite your partner", "Inviter partneren din", "Invitér din partner"], "Den andra föräldern": ["The other parent", "Den andre forelderen", "Den anden forælder"], "Din sambo": ["Your partner", "Samboeren din", "Din samlever"], "Din partner": ["Your partner", "Partneren din", "Din partner"]};
const I18N_PAT = [["^(.+): ny rad$", "{1}: new line", "{1}: ny linje", "{1}: ny linje"], ["^(.+): ny sak$", "{1}: new item", "{1}: ny ting", "{1}: ny ting"], ["^([\\d\\s.,]+ kr)/mån$", "{1}/month", "{1}/mnd", "{1}/md."], ["^Du betalade\\. ska betala dig (.+)\\.$", "You paid. The other pays you {1}.", "Du betalte. Den andre skal betale deg {1}.", "Du betalte. Den anden skal betale dig {1}."], ["^(\\d+(?:,\\d+)?) st$", "{1} pcs", "{1} stk", "{1} stk."], ["^(\\d+(?:,\\d+)?) burkar?$", "{1} can(s)", "{1} boks(er)", "{1} dåse(r)"], ["^(\\d+(?:,\\d+)?) påsar?$", "{1} bag(s)", "{1} pose(r)", "{1} pose(r)"], ["^(\\d+(?:,\\d+)?) paket$", "{1} pack(s)", "{1} pakke(r)", "{1} pakke(r)"], ["^(\\d+(?:,\\d+)?) klyftor$", "{1} cloves", "{1} fedd", "{1} fed"], ["^(\\d+(?:,\\d+)?) tub$", "{1} tube", "{1} tube", "{1} tube"], ["^(\\d+(?:,\\d+)?) portioner$", "{1} servings", "{1} porsjoner", "{1} portioner"], ["^Hej (.+)$", "Hi {1}", "Hei {1}", "Hej {1}"], ["^(\\d+) händelser i veckan$", "{1} events this week", "{1} hendelser denne uken", "{1} begivenheder i denne uge"], ["^Du är skyldig (.+?) ([\\d\\s.,]+ kr)$", "You owe {1} {2}", "Du skylder {1} {2}", "Du skylder {1} {2}"], ["^(.+) är skyldig dig ([\\d\\s.,]+ kr)$", "{1} owes you {2}", "{1} skylder deg {2}", "{1} skylder dig {2}"], ["^Delas med (.+)$", "Shared with {1}", "Delt med {1}", "Delt med {1}"], ["^delas med (.+)$", "shared with {1}", "delt med {1}", "delt med {1}"], ["^Gemensamt med (.+)$", "Shared with {1}", "Felles med {1}", "Fælles med {1}"], ["^Syns för dig och (.+)$", "Visible to you and {1}", "Synlig for deg og {1}", "Synlig for dig og {1}"], ["^Familjens kalender – syns för (.+) också$", "Family calendar – {1} sees it too", "Familiens kalender – {1} ser den også", "Familiens kalender – {1} ser den også"], ["^Hemmets kalender – syns för (.+) också$", "Home calendar – {1} sees it too", "Hjemmets kalender – {1} ser den også", "Hjemmets kalender – {1} ser den også"], ["^Lägg in i (familjens|hemmets) kalender$", "Add to the calendar", "Legg inn i kalenderen", "Tilføj til kalenderen"], ["^(\\d+) saker att handla$", "{1} things to buy", "{1} ting å handle", "{1} ting at købe"], ["^(\\d+) kvar$", "{1} left", "{1} igjen", "{1} tilbage"], ["^(\\d+) idag eller i morgon$", "{1} today or tomorrow", "{1} i dag eller i morgen", "{1} i dag eller i morgen"], ["^1 ny notis$", "1 new notification", "1 nytt varsel", "1 ny notifikation"], ["^(\\d+) nya notiser$", "{1} new notifications", "{1} nye varsler", "{1} nye notifikationer"], ["^1 kompis$", "1 friend", "1 venn", "1 ven"], ["^(\\d+) kompisar$", "{1} friends", "{1} venner", "{1} venner"], ["^(\\d+) kvitton$", "{1} receipts", "{1} kvitteringer", "{1} kvitteringer"], ["^Du betalade (.+)$", "You paid {1}", "Du betalte {1}", "Du betalte {1}"], ["^(.+) betalade dig$", "{1} paid you", "{1} betalte deg", "{1} betalte dig"], ["^(.+) betalade (.+)$", "{1} paid {2}", "{1} betalte {2}", "{1} betalte {2}"], ["^(.+) betalade$", "{1} paid", "{1} betalte", "{1} betalte"], ["^din del (.+)$", "your share {1}", "din del {1}", "din andel {1}"], ["^får (.+)$", "gets {1}", "får {1}", "får {1}"], ["^Du betalade\\. (.+) ska betala dig (.+)\\.$", "You paid. {1} pays you {2}.", "Du betalte. {1} skal betale deg {2}.", "Du betalte. {1} skal betale dig {2}."], ["^(.+) betalade\\. Din del är (.+)\\.$", "{1} paid. Your share is {2}.", "{1} betalte. Din del er {2}.", "{1} betalte. Din andel er {2}."], ["^Du betalar (.+)$", "You pay {1}", "Du betaler {1}", "Du betaler {1}"], ["^(.+) betalar dig$", "{1} pays you", "{1} betaler deg", "{1} betaler dig"], ["^Jag har betalat (.+)$", "I've paid {1}", "Jeg har betalt {1}", "Jeg har betalt {1}"], ["^(.+) har betalat mig$", "{1} has paid me", "{1} har betalt meg", "{1} har betalt mig"], ["^Lagt per barn (\\d+)$", "Spent per child {1}", "Brukt per barn {1}", "Brugt pr. barn {1}"], ["^Utgifter per månad (\\d+) jämfört med (\\d+)$", "Spending per month {1} compared with {2}", "Utgifter per måned {1} sammenlignet med {2}", "Udgifter pr. måned {1} sammenlignet med {2}"], ["^Utgifter (.+)$", "Spending {1}", "Utgifter {1}", "Udgifter {1}"], ["^Kvitton (.+)$", "Receipts {1}", "Kvitteringer {1}", "Kvitteringer {1}"], ["^(▲|▼) (\\d+) % mot (.+)$", "{1} {2}% vs {3}", "{1} {2} % mot {3}", "{1} {2} % mod {3}"], ["^([\\d\\s.,]+ kr) över budget$", "{1} over budget", "{1} over budsjett", "{1} over budget"], ["^([\\d\\s.,]+ kr) kvar\\. Spara ([\\d\\s.,]+ kr)/mån för att nå målet till (.+)\\.$", "{1} left. Save {2}/month to reach the goal by {3}.", "{1} igjen. Spar {2}/mnd for å nå målet innen {3}.", "{1} tilbage. Spar {2}/md. for at nå målet til {3}."], ["^([\\d\\s.,]+ kr) kvar\\.$", "{1} left.", "{1} igjen.", "{1} tilbage."], ["^([\\d\\s.,]+ kr) kvar$", "{1} left", "{1} igjen", "{1} tilbage"], ["^(\\d+) % använt$", "{1}% used", "{1} % brukt", "{1} % brugt"], ["^([\\d\\s.,]+ kr) av ([\\d\\s.,]+ kr)$", "{1} of {2}", "{1} av {2}", "{1} af {2}"], ["^av ([\\d\\s.,]+ kr)$", "of {1}", "av {1}", "af {1}"], ["^1 år$", "1 year", "1 år", "1 år"], ["^(\\d+) år$", "{1} years", "{1} år", "{1} år"], ["^född (.+)$", "born {1}", "født {1}", "født {1}"], ["^skor (.+)$", "shoes {1}", "sko {1}", "sko {1}"], ["^strl (.+)$", "size {1}", "str. {1}", "str. {1}"], ["^Barnkort: (.+)$", "Child card: {1}", "Barnekort: {1}", "Børnekort: {1}"], ["^Senast ändrat av (.+?) (\\d.*)\\.$", "Last changed by {1} on {2}.", "Sist endret av {1} {2}.", "Senest ændret af {1} {2}."], ["^Senast gjort av (.+?) (\\d.*)$", "Last done by {1} {2}", "Sist gjort av {1} {2}", "Senest gjort af {1} {2}"], ["^Startade (.+)$", "Started {1}", "Startet {1}", "Startet {1}"], ["^den (\\d+) varje månad$", "on the {1}th every month", "den {1}. hver måned", "den {1}. hver måned"], ["^t\\.o\\.m\\. (.+)$", "until {1}", "t.o.m. {1}", "t.o.m. {1}"], ["^reklamation t\\.o\\.m\\. (.+)$", "complaints until {1}", "reklamasjon t.o.m. {1}", "reklamation t.o.m. {1}"], ["^Reklamation/garanti t\\.o\\.m\\. (.+)$", "Complaints/warranty until {1}", "Reklamasjon/garanti t.o.m. {1}", "Reklamation/garanti t.o.m. {1}"], ["^Reklamationstiden gick ut (.+)\\.$", "The complaint period ended {1}.", "Reklamasjonstiden gikk ut {1}.", "Reklamationsretten udløb {1}."], ["^Hälsning från (.+)$", "Message from {1}", "Hilsen fra {1}", "Hilsen fra {1}"], ["^Hälsning till (.+)$", "Message to {1}", "Hilsen til {1}", "Hilsen til {1}"], ["^Din hälsning till (.+)$", "Your message to {1}", "Din hilsen til {1}", "Din hilsen til {1}"], ["^Händelser och kvitton från (.+)$", "Events and receipts from {1}", "Hendelser og kvitteringer fra {1}", "Begivenheder og kvitteringer fra {1}"], ["^Skicka förfrågan till (.+)$", "Send request to {1}", "Send forespørsel til {1}", "Send anmodning til {1}"], ["^Skicka till (.+)$", "Send to {1}", "Send til {1}", "Send til {1}"], ["^Skriv en hälsning till (.+)$", "Write a message to {1}", "Skriv en hilsen til {1}", "Skriv en hilsen til {1}"], ["^Skriv några rader till (.+) inför bytet, t\\.ex\\. om sjukdom, läxor eller saker som glömts\\.$", "Write a few lines to {1} before the changeover, e.g. about illness, homework or forgotten things.", "Skriv noen linjer til {1} før byttet, f.eks. om sykdom, lekser eller ting som er glemt.", "Skriv et par linjer til {1} før skiftet, f.eks. om sygdom, lektier eller ting, der er glemt."], ["^Förfrågan skickad till (.+)$", "Request sent to {1}", "Forespørsel sendt til {1}", "Anmodning sendt til {1}"], ["^Förslaget är skickat till (.+)$", "Proposal sent to {1}", "Forslaget er sendt til {1}", "Forslaget er sendt til {1}"], ["^Hälsningen är skickad till (.+)$", "Message sent to {1}", "Hilsenen er sendt til {1}", "Hilsenen er sendt til {1}"], ["^(.+) får en förfrågan att godkänna$", "{1} gets a request to approve", "{1} får en forespørsel å godkjenne", "{1} får en anmodning om godkendelse"], ["^Bestäm var barnen är på loven\\. (.+) godkänner, sedan läggs det in i kalendern\\.$", "Decide where the children are during holidays. {1} approves, then it's added to the calendar.", "Bestem hvor barna er i feriene. {1} godkjenner, så legges det inn i kalenderen.", "Bestem, hvor børnene er i ferierne. {1} godkender, så lægges det ind i kalenderen."], ["^Just nu är barnen hos (\\S+) (.+)$", "Right now the children are with {1} {2}", "Akkurat nå er barna hos {1} {2}", "Lige nu er børnene hos {1} {2}"], ["^(.+)s andel \\(%\\)$", "{1}'s share (%)", "{1} sin andel (%)", "{1}s andel (%)"], ["^Strecket under datumen visar var barnen bor: färgat = hos dig, grått = hos (.+)\\.$", "The line under the dates shows where the children live: coloured = with you, grey = with {1}.", "Streken under datoene viser hvor barna bor: farget = hos deg, grå = hos {1}.", "Stregen under datoerne viser, hvor børnene bor: farvet = hos dig, grå = hos {1}."], ["^Boendeschema: (.+)$", "Living schedule: {1}", "Bostedsplan: {1}", "Samværsplan: {1}"], ["^Mina barn i Mitt(.*)$", "My children in Mine{1}", "Mine barn i Mitt{1}", "Mine børn i Mit{1}"], ["^Tips: skriv direkt på startsidan, t\\.ex\\. \"köpa ny jacka till (.+)\"\\.$", "Tip: type straight on the start page, e.g. \"buy a new jacket for {1}\".", "Tips: skriv rett på startsiden, f.eks. «kjøpe ny jakke til {1}».", "Tip: skriv direkte på forsiden, f.eks. \"købe ny jakke til {1}\"."], ["^Nya rader kopplas till (.+)\\.$", "New lines are linked to {1}.", "Nye linjer kobles til {1}.", "Nye linjer knyttes til {1}."], ["^T\\.ex\\. (.+) leker med (.+) (\\d+ \\S+) kl (\\d+)$", "E.g. {1} plays with {2} {3} at {4}", "F.eks. {1} leker med {2} {3} kl {4}", "F.eks. {1} leger med {2} {3} kl {4}"], ["^Bocka av (.+)$", "Check off {1}", "Kryss av {1}", "Afkryds {1}"], ["^Ångra (.+)$", "Undo {1}", "Angre {1}", "Fortryd {1}"], ["^Markera (.+) som gjord$", "Mark {1} as done", "Marker {1} som gjort", "Markér {1} som gjort"], ["^Kopiera numret till (.+)s förälder$", "Copy the number of {1}'s parent", "Kopier nummeret til forelderen til {1}", "Kopiér nummeret til {1}s forælder"], ["^Ta bort (.+)$", "Delete {1}", "Slett {1}", "Slet {1}"], ["^Ändra (.+)$", "Edit {1}", "Endre {1}", "Ændr {1}"], ["^Lägg in alla rätter \\((\\d+)\\)$", "Add all dishes ({1})", "Legg inn alle retter ({1})", "Tilføj alle retter ({1})"], ["^(\\d+) varor på inköpslistan \\((\\d+) fanns redan\\)$", "{1} items on the shopping list ({2} already there)", "{1} varer på handlelisten ({2} fantes allerede)", "{1} varer på indkøbslisten ({2} fandtes allerede)"], ["^(\\d+) varor på inköpslistan$", "{1} items on the shopping list", "{1} varer på handlelisten", "{1} varer på indkøbslisten"], ["^(\\d+) händelser tillagda$", "{1} events added", "{1} hendelser lagt til", "{1} begivenheder tilføjet"], ["^Sparat\\. (.+) har fått en notis\\.$", "Saved. {1} has been notified.", "Lagret. {1} har fått et varsel.", "Gemt. {1} har fået en notifikation."], ["^Bra jobbat, (.+)! Nästa gång: (.+), (.+)$", "Well done, {1}! Next time: {2}, {3}", "Bra jobbet, {1}! Neste gang: {2}, {3}", "Godt klaret, {1}! Næste gang: {2}, {3}"], ["^Bra jobbat! Nästa gång: (.+), (.+)$", "Well done! Next time: {1}, {2}", "Bra jobbet! Neste gang: {1}, {2}", "Godt klaret! Næste gang: {1}, {2}"], ["^Grattis! Du har nått målet (.+)$", "Congratulations! You've reached the goal {1}", "Gratulerer! Du har nådd målet {1}", "Tillykke! Du har nået målet {1}"], ["^([\\d\\s.,]+ kr) insatt$", "{1} deposited", "{1} satt inn", "{1} indsat"], ["^([\\d\\s.,]+ kr) uttaget$", "{1} withdrawn", "{1} tatt ut", "{1} hævet"], ["^(.+) är godkänt och kalendern uppdaterad$", "{1} approved and the calendar updated", "{1} er godkjent og kalenderen oppdatert", "{1} er godkendt og kalenderen opdateret"], ["^(.+) är tillagd$", "{1} has been added", "{1} er lagt til", "{1} er tilføjet"], ["^(.+) är borttagen$", "{1} has been removed", "{1} er fjernet", "{1} er fjernet"], ["^Bjud in (.+) först$", "Invite {1} first", "Inviter {1} først", "Invitér {1} først"], ["^Bjud in (.+)$", "Invite {1}", "Inviter {1}", "Invitér {1}"], ["^Nu finns (.+) på startsidan$", "{1} is now on the start page", "Nå finnes {1} på startsiden", "Nu findes {1} på forsiden"], ["^Förfrågan om (.+)$", "Request: {1}", "Forespørsel: {1}", "Anmodning: {1}"], ["^(.+): (.+) undrar om barnen kan vara hos (dig|.+?) (.+)\\.$", "{1}: {2} asks if the children can be with {3} {4}.", "{1}: {2} spør om barna kan være hos {3} {4}.", "{1}: {2} spørger, om børnene kan være hos {3} {4}."], ["^(.+) undrar om barnen kan vara hos (dig|.+?) (.+)\\.$", "{1} asks if the children can be with {2} {3}.", "{1} spør om barna kan være hos {2} {3}.", "{1} spørger, om børnene kan være hos {2} {3}."], ["^(.+): Du har frågat (.+?) om barnen kan vara hos (.+?) (.+)\\.$", "{1}: You asked {2} if the children can be with {3} {4}.", "{1}: Du har spurt {2} om barna kan være hos {3} {4}.", "{1}: Du har spurgt {2}, om børnene kan være hos {3} {4}."], ["^Du har frågat (.+?) om barnen kan vara hos (.+?) (.+)\\.$", "You asked {1} if the children can be with {2} {3}.", "Du har spurt {1} om barna kan være hos {2} {3}.", "Du har spurgt {1}, om børnene kan være hos {2} {3}."], ["^Barnen är hos (.+)$", "The children are with {1}", "Barna er hos {1}", "Børnene er hos {1}"], ["^Barnen går till (.+)$", "The children go to {1}", "Barna drar til {1}", "Børnene skal til {1}"], ["^Byte (.+)$", "Changeover {1}", "Bytte {1}", "Skift {1}"], ["^packlista (\\d+) av (\\d+) klar$", "packing list {1} of {2} done", "pakkeliste {1} av {2} klar", "pakkeliste {1} af {2} klar"], ["^hos dig$", "with you", "hos deg", "hos dig"], ["^hos (.+)$", "with {1}", "hos {1}", "hos {1}"], ["^ansvar: (.+)$", "responsible: {1}", "ansvar: {1}", "ansvar: {1}"], ["^med (.+)$", "with {1}", "med {1}", "med {1}"], ["^Leker hos (.+)$", "Playdate at {1}'s", "Leker hos {1}", "Leger hos {1}"], ["^Leker med (.+)$", "Playing with {1}", "Leker med {1}", "Leger med {1}"], ["^(.+): barnen hos (.+)$", "{1}: the children with {2}", "{1}: barna hos {2}", "{1}: børnene hos {2}"], ["^Barnen hos (.+)$", "The children with {1}", "Barna hos {1}", "Børnene hos {1}"], ["^(.+)s tur$", "{1}'s turn", "{1} sin tur", "{1}s tur"], ["^sedan (.+)$", "then {1}", "deretter {1}", "derefter {1}"], ["^om (\\d+) dagar$", "in {1} days", "om {1} dager", "om {1} dage"], ["^(\\d+) min$", "{1} min", "{1} min", "{1} min"], ["^Undvik: (.+)$", "Avoid: {1}", "Unngå: {1}", "Undgå: {1}"], ["^Förslag med ingredienser som du lägger på er gemensamma inköpslista$", "Ideas with ingredients you put on your shared shopping list", "Forslag med ingredienser du legger på deres felles handleliste", "Forslag med ingredienser, du lægger på jeres fælles indkøbsliste"], ["^Förslag med ingredienser som du lägger på inköpslistan$", "Ideas with ingredients you put on the shopping list", "Forslag med ingredienser du legger på handlelisten", "Forslag med ingredienser, du lægger på indkøbslisten"], ["^(.+) \\(du\\)$", "{1} (you)", "{1} (deg)", "{1} (dig)"], ["^Lagt till: (.+)\\.$", "Added: {1}.", "Lagt til: {1}.", "Tilføjet: {1}."], ["^Inlagt som text: (.+)$", "Added as text: {1}", "Lagt inn som tekst: {1}", "Tilføjet som tekst: {1}"], ["^(.+) finns inte på något barnkort\\.$", "{1} isn't on any child card.", "{1} finnes ikke på noe barnekort.", "{1} findes ikke på noget børnekort."], ["^Lägg till (.+) på (.+)s barnkort$", "Add {1} to {2}'s child card", "Legg til {1} på barnekortet til {2}", "Tilføj {1} på {2}s børnekort"], ["^(.+) finns på (.+)s barnkort: (.+)$", "{1} is on {2}'s child card: {3}", "{1} finnes på barnekortet til {2}: {3}", "{1} findes på {2}s børnekort: {3}"], ["^(.+) lade in (.+) för (.+)\\. Din del: (.+)\\.$", "{1} added {2} for {3}. Your share: {4}.", "{1} la inn {2} for {3}. Din del: {4}.", "{1} tilføjede {2} for {3}. Din andel: {4}."], ["^(.+) har köpt (.+) på (.+) för (.+?)(?: till (.+))?\\. Du är skyldig (.+?) (.+)\\.$", "{1} bought {2} at {3} for {4} {5}. You owe {6} {7}.", "{1} har kjøpt {2} på {3} for {4} {5}. Du skylder {6} {7}.", "{1} har købt {2} hos {3} for {4} {5}. Du skylder {6} {7}."], ["^(.+) lade till \"(.+)\" (.+)\\.$", "{1} added \"{2}\" {3}.", "{1} la til «{2}» {3}.", "{1} tilføjede \"{2}\" {3}."], ["^(.+) lade in \"(.+)\" (.+)\\.$", "{1} added \"{2}\" {3}.", "{1} la inn «{2}» {3}.", "{1} tilføjede \"{2}\" {3}."], ["^(.+) har betalat dig (.+)\\.$", "{1} has paid you {2}.", "{1} har betalt deg {2}.", "{1} har betalt dig {2}."], ["^(.+) har skrivit en hälsning inför bytet: (.+)$", "{1} wrote a message before the changeover: {2}", "{1} har skrevet en hilsen før byttet: {2}", "{1} har skrevet en hilsen før skiftet: {2}"], ["^(.+) sa ja till (.+)\\.(.*)$", "{1} said yes to {2}.{3}", "{1} sa ja til {2}.{3}", "{1} sagde ja til {2}.{3}"], ["^(.+) kunde tyvärr inte (.+)\\.$", "{1} unfortunately couldn't do {2}.", "{1} kunne dessverre ikke {2}.", "{1} kunne desværre ikke {2}."], ["^(.+) uppdaterade (.+)s barnkort\\.$", "{1} updated {2}'s child card.", "{1} oppdaterte barnekortet til {2}.", "{1} opdaterede {2}s børnekort."], ["^(.+) har gått med i Vardagen\\.$", "{1} has joined Vardagen.", "{1} har blitt med i Vardagen.", "{1} er kommet med i Vardagen."], ["^ Kalendern är uppdaterad\\.$", " The calendar is updated.", " Kalenderen er oppdatert.", " Kalenderen er opdateret."], ["^(.+) \\((.+)\\)$", "{1} ({2})", "{1} ({2})", "{1} ({2})"], ["^Nästan klart! Vi har skickat en länk till (.+)\\. Klicka på den för att bekräfta din e-post och logga sedan in\\.$", "Almost done! We've sent a link to {1}. Click it to confirm your email, then sign in.", "Nesten ferdig! Vi har sendt en lenke til {1}. Klikk på den for å bekrefte e-posten, og logg deretter inn.", "Næsten færdig! Vi har sendt et link til {1}. Klik på det for at bekræfte din e-mail, og log derefter ind."], ["^Länken gäller i 14 dagar och kan användas en gång\\. Den ger bara tillgång till (.+), aldrig till din privata del\\.$", "The link is valid for 14 days and can be used once. It only gives access to {1}, never to your private part.", "Lenken gjelder i 14 dager og kan brukes én gang. Den gir bare tilgang til {1}, aldri til din private del.", "Linket gælder i 14 dage og kan bruges én gang. Det giver kun adgang til {1}, aldrig til din private del."], ["^Hej! Jag har bjudit in dig till (.+) i appen Vardagen\\. Öppna länken för att gå med:$", "Hi! I've invited you to {1} in the Vardagen app. Open the link to join:", "Hei! Jeg har invitert deg til {1} i appen Vardagen. Åpne lenken for å bli med:", "Hej! Jeg har inviteret dig til {1} i appen Vardagen. Åbn linket for at komme med:"]].map(([src, ...out]) => [new RegExp(src), out]);
const I18N_FRAG = [
  ["på er gemensamma inköpslista","on your shared shopping list","på deres felles handleliste","på jeres fælles indkøbsliste"],
  ["på inköpslistan","on the shopping list","på handlelisten","på indkøbslisten"],
  ["i Att göra till","in To-do for","i Gjøremål til","i Opgaver til"],
  ["i Att göra","in To-do","i Gjøremål","i Opgaver"],
  ["i din kalender","in your calendar","i kalenderen din","i din kalender"],
  ["inget nummer","no number","ikke noe nummer","intet nummer"],
  ["Visa listor","Show lists","Vis lister","Vis lister"],
  ["Visa kalendern","Show calendar","Vis kalenderen","Vis kalenderen"],
  [" i övermorgon"," the day after tomorrow"," i overmorgen"," i overmorgen"],
  [" i morgon"," tomorrow"," i morgen"," i morgen"],
  [" idag"," today"," i dag"," i dag"]
];
function t(sv){
  if (LANG === "sv" || sv == null || sv === "") return sv;
  const i = LIX[LANG], d = I18N_DICT[sv];
  if (d) return d[i];
  for (const [re, out] of I18N_PAT) { const m = sv.match(re); if (m) return out[i].replace(/\{(\d)\}/g, (_, n) => m[n] == null ? "" : t(m[n])); }
  let o = sv; for (const f of I18N_FRAG) if (o.includes(f[0])) o = o.split(f[0]).join(f[i + 1]);
  return o;
}
const tr = sv => t(sv); // alias for scopes that use `t` for a date
function trText(s){
  const m = s.match(/^(\s*)([\s\S]*?)(\s*)$/); if (!m[2]) return s;
  return m[1] + m[2].split(/(\s+·\s+|\s+·$|^·\s+)/).map((p, k) => k % 2 ? p : t(p)).join("") + m[3];
}
const TR_ATTRS = ["placeholder", "aria-label", "title", "label"];
function trNode(root){
  if (LANG === "sv" || !root) return;
  if (root.nodeType === 3) { if (!root.parentElement?.closest("script,style")) { const v = root.nodeValue, x = trText(v); if (x !== v) root.nodeValue = x; } return; }
  if (root.nodeType !== 1 || root.closest("script,style")) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT); let n = root;
  do {
    if (n.nodeType === 3) { if (!n.parentElement?.closest("script,style")) { const v = n.nodeValue, x = trText(v); if (x !== v) n.nodeValue = x; } }
    else for (const a of TR_ATTRS) { const v = n.getAttribute(a); if (v) { const x = trText(v); if (x !== v) n.setAttribute(a, x); } }
  } while ((n = w.nextNode()));
}
new MutationObserver(ms => {
  if (LANG === "sv") return;
  for (const m of ms) {
    if (m.type === "childList") m.addedNodes.forEach(trNode);
    else if (m.type === "characterData") trNode(m.target);
    else if (m.type === "attributes") { const v = m.target.getAttribute(m.attributeName); if (v) { const x = trText(v); if (x !== v) m.target.setAttribute(m.attributeName, x); } }
  }
}).observe(document.body, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:TR_ATTRS});
let MONTHS, MON_D, DOW;
function buildCalNames(){
  MONTHS = Array.from({length:12}, (_, i) => new Date(2021, i, 1).toLocaleDateString(LOC, {month:"long"}));
  MON_D = Array.from({length:12}, (_, i) => new Date(2021, i, 1).toLocaleDateString(LOC, {month:"short"}).replace(/\.$/, ""));
  DOW = Array.from({length:7}, (_, i) => new Date(2021, 1, 1 + i).toLocaleDateString(LOC, {weekday:"short"}).replace(/\.$/, ""));
}
buildCalNames();
document.documentElement.lang = LANG === "nb" ? "nb" : LANG;
window.VardagenLang = () => LANG;
window.VardagenSetLang = l => setLang(l, S.mode === "live");
function setLang(l, save = true){
  if (!LANGS[l]) return;
  LANG = l; LOC = LANGS[l].loc; buildCalNames();
  document.documentElement.lang = l;
  try { localStorage.setItem("vardagen.lang", l); } catch(e) {}
  if (save && S.mode === "live") saveDocs("my", [{kind:"settings", lang:l}], "settings");
  render(); trNode(document.body); trNode(document.body); trNode(document.body); trNode(document.body);
}

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtKr = n => new Intl.NumberFormat(LOC,{maximumFractionDigits:0}).format(Math.round(n||0)) + " kr";
const pad = n => String(n).padStart(2,"0");
const ymd = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const parseD = s => { const [y,m,d] = String(s).split("-").map(Number); return new Date(y,(m||1)-1,d||1); };
const addDays = (d,n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const dayLabel = s => { const d = parseD(s), t = new Date(); const td = ymd(t), tm = ymd(addDays(t,1));
  if (s===td) return "Idag"; if (s===tm) return "I morgon";
  return d.toLocaleDateString(LOC,{weekday:"long",day:"numeric",month:"long"}).replace(/^./,c=>c.toUpperCase()); };
const dayLow = k => { const d = dayLabel(k); return LANG === "en" && !/^(Idag|I morgon)$/.test(d) ? d : d.toLowerCase(); };
const uidGen = () => Math.random().toString(36).slice(2,10);
const KID_COLORS = ["var(--k1)","var(--k2)","var(--k3)","var(--k4)","var(--k5)","var(--k6)","var(--k7)","var(--k8)"];
const MY_CATS = ["Mat","Boende","Hem","Renovering","Barn","Underhållsbidrag","Kläder","Transport","Nöje & restaurang","Hälsa","Försäkringar","Abonnemang","Övrigt"];
const PATTERNS = {vv:{label:"Vecka-vecka", cycle:"AAAAAAABBBBBBB"}, "2255":{label:"2-2-5-5", cycle:"AABBAAAAABBBBB"}, "223":{label:"2-2-3", cycle:"AABBAAABBAABBB"}, helg:{label:"Varannan helg (fre–sön)", cycle:"AAAAAAAAAAABBB"}};
const KID_INFO = [["clothes","Klädstorlek","Ex. 134/140"],["shoes","Skostorlek","Ex. 33"],["allergies","Allergier","Ex. nötter, pollen"],["meds","Mediciner","Ex. astmaspray vid behov"],["health","Vårdcentral / BVC / tandvård",""],["school","Skola / förskola, klass och lärare",""],["contacts","Viktiga kontakter","Ex. mormor 070-123 45 67, fritids 08-123 45"],["notes","Övrigt att veta",""]];
const HOME_CATS = ["Hyra & boende","Mat & hushåll","El & värme","Bredband & abonnemang","Hem & inredning","Resor & nöje","Övrigt"];
const HH = {
  separerad:{label:"Separerad med barn", desc:"Delad barnkalender och kostnader med andra föräldern", shared:true, kids:true, stays:true, space:"Familjen", partner:"den andra föräldern", tabKids:"Barn & föräldrar", members:"Föräldrar", icon:"family", cats:["Kläder","Skor","Aktiviteter & avgifter","Skola & förskola","Hälsa & tandvård","Leksaker & presenter","Mat & fika","Övrigt"], demo:["Pappa","Mamma"]},
  separeradpartner:{label:"Separerad med barn + ny partner", desc:"Delad barnkalender med andra föräldern och ett eget hem med din partner", shared:true, kids:true, stays:true, hem:true, space:"Familjen", partner:"den andra föräldern", tabKids:"Barn & föräldrar", members:"Föräldrar", icon:"family", cats:["Kläder","Skor","Aktiviteter & avgifter","Skola & förskola","Hälsa & tandvård","Leksaker & presenter","Mat & fika","Övrigt"], demo:["Pappa","Mamma"]},
  ensam:{label:"Bor ensam", desc:"Kalender, budget och listor – bara för dig", shared:false, kids:false, stays:false, space:"", partner:"", icon:"me", cats:[], demo:["Alex",null]},
  sambo:{label:"Sambo", desc:"Delad kalender, hushållskostnader och inköpslista", shared:true, kids:false, stays:false, sharedShop:true, space:"Hemmet", partner:"din sambo", tabKids:"Vi två", members:"Vi två", icon:"home", cats:HOME_CATS, demo:["Alex","Sam"]},
  sambobarn:{label:"Sambo med barn", desc:"Delad familjekalender, kostnader och inköpslista", shared:true, kids:true, stays:false, sharedShop:true, space:"Familjen", partner:"din sambo", tabKids:"Barn & vi", members:"Vi vuxna", icon:"family", cats:["Hyra & boende","Mat & hushåll","El & värme","Hem & inredning","Barnkläder & skor","Barnens aktiviteter","Skola & förskola","Hälsa","Resor & nöje","Övrigt"], demo:["Alex","Sam"]}
};
const KINDS = {aktivitet:"Aktivitet",lek:"Lek hos kompis",skola:"Skola / förskola",hamtning:"Hämtning / lämning",boende:"Bor hos",annat:"Annat"};

const IC = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
  family:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="6" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="12" cy="12.5" r="2"/><path d="M3 20v-4a4 4 0 0 1 4-4h0M21 20v-4a4 4 0 0 0-4-4h0M9 21v-2.5a3 3 0 0 1 6 0V21"/></svg>',
  me:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  money:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3v18l3-2 3 2 3-2 3 2 3-2V3l-3 2-3-2-3 2-3-2z"/><path d="M8 9h8M8 13h5"/></svg>',
  kids:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 21a5.5 5.5 0 0 1 11 0M13.5 21a3.5 3.5 0 0 1 7 0"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M8 17V11M13 17V7M18 17v-4"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7.5 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.5z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h11M10 12h11M10 18h11"/><path d="M3 6l1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/></svg>',
  archive:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="5" rx="1.5"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/></svg>',
  clip:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11l-8.5 8.5a5 5 0 0 1-7-7L14 4a3.5 3.5 0 0 1 5 5l-8.5 8.5a2 2 0 0 1-3-3L15 7"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  swish:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 0 1-14.9 4M4 12a8 8 0 0 1 14.9-4"/><path d="M19 3v5h-5M5 21v-5h5"/></svg>'
};

/* ---------- state ---------- */
const S = {
  mode:"demo", canWrite:true, uid:null, db:null, sample:null, canImages:false, assets:null,
  view:"home", tab:{shared:"cal", mine:"budget"},
  parents:{}, children:[], events:[], expenses:[], payments:[], notices:[],
  my:[], // private docs: kind exp | event | proj | settings
  calMonth:{shared:firstOfMonth(new Date()), mine:firstOfMonth(new Date())},
  selDay:{shared:ymd(new Date()), mine:ymd(new Date())},
  kidFilter:null, showSharedInMine:true,
  budgetPeriod:"month", budgetMonth:new Date().getMonth(), budgetYear:new Date().getFullYear(),
  ready:false, space:null, stash:{}, hemData:null, hemTab:null, schedule:null, swaps:[], pack:[], handover:[], chores:[], sharedShop:[], cmdMsg:"", calMsg:"", listKid:null, archQ:"", archScope:"all", imgCache:{}, downloads:null
};
function firstOfMonth(d){ return new Date(d.getFullYear(), d.getMonth(), 1); }
try { const v = JSON.parse(localStorage.getItem("tvahem.view")||"{}"); for (const k of ["view","tab","showSharedInMine"]) if (k in v) S[k] = v[k]; if (S.tab && !S.tab.mine) S.tab = {shared:"cal", mine:"budget"}; } catch(e){}
S.calMonth = {shared:firstOfMonth(new Date()), mine:firstOfMonth(new Date())};
function remember(){ if (S.space === "hem") return; try { localStorage.setItem("tvahem.view", JSON.stringify({view:S.view, tab:S.tab, showSharedInMine:S.showSharedInMine})); } catch(e){} }

const me = () => S.parents[S.uid] || {label:"Du"};
const otherIds = () => Object.keys(S.parents).filter(id => id !== S.uid);
const otherId = () => otherIds()[0] || null;
const HEM = {label:"Hemmet", shared:true, kids:false, stays:false, sharedShop:true, space:"Hemmet", partner:"din partner", tabKids:"Vi två", members:"Vi två", icon:"home", cats:HOME_CATS};
const H = () => S.space === "hem" ? HEM : (HH[settings().household] || HH.separerad);
const hasHem = () => !!(HH[settings().household]?.hem);
/* Hemmet with a new partner is its own space with its own members. Signed in, it is stored for real
   (S.dbHem); in the example mode it lives in memory only. */
const HEM_KEYS = ["parents","events","expenses","payments","sharedShop","chores","notices","swaps","pack","handover"];
const hemLive = () => S.mode === "live" && !!S.dbHem;
function hemData(){
  if (S.hemData) return S.hemData;
  if (S.mode === "live") { S.hemData = {parents:{}, events:[], expenses:[], payments:[], sharedShop:[], chores:[], notices:[], swaps:[], pack:[], handover:[]}; return S.hemData; }
  const t = new Date(), d = n => ymd(addDays(t,n)), meId = S.uid, P = "u_partner";
  const myLabel = (S.space === "hem" ? S.stash.parents : S.parents)?.[meId]?.label || settings().name || "Du";
  S.hemData = {
    parents: {[meId]:{label:myLabel}, [P]:{label:"Robin"}},
    events: [{id:"he1",title:"Hämta IKEA-beställningen",date:d(1),start:"10:00",end:"",kind:"hamtning",childIds:[],with:meId},
             {id:"he2",title:"Middag hos Robins föräldrar",date:d(2),start:"18:00",end:"",kind:"annat",childIds:[],with:""},
             {id:"he3",title:"Bio",date:d(5),start:"19:30",end:"22:00",kind:"annat",childIds:[],with:""}],
    expenses: [{id:"hx1",store:"ICA Maxi",amount:1240,date:d(-3),category:"Mat & hushåll",childIds:[],split:50,paidBy:meId,items:[]},
               {id:"hx2",store:"Ellevio",amount:890,date:d(-8),category:"El & värme",childIds:[],split:50,paidBy:P},
               {id:"hx3",store:"Hyra oktober",amount:12400,date:d(-14),category:"Hyra & boende",childIds:[],split:50,paidBy:P}],
    payments: [{id:"hp1",from:meId,to:P,amount:6000,date:d(-12)}],
    sharedShop: [{id:"hs1",text:"Kaffe",group:"mat",done:false,createdAt:1},{id:"hs2",text:"Tvättmedel",group:"mat",done:false,createdAt:2},{id:"hs3",text:"Glödlampor till hallen",group:"",done:false,createdAt:3}],
    chores: [{id:"hc1",name:"Dammsuga",every:7,people:["u:"+meId,"u:"+P],idx:1,due:d(1)},{id:"hc2",name:"Sopor och återvinning",every:3,people:["u:"+meId,"u:"+P],idx:0,due:d(0)}],
    notices: [], swaps: [], pack: [], handover: []
  };
  return S.hemData;
}
async function enterHem(){
  if (S.space === "hem") return;
  if (S.mode === "live" && !S.dbHem && S.canWrite) {
    try { subscribeHem(await window.Vardagen.ensureHemSpace()); } catch(e) { toast("Kunde inte öppna Hemmet. Försök igen."); return; }
  }
  const hd = hemData();
  S.stash = {tab:S.tab.shared};
  for (const k of HEM_KEYS) { S.stash[k] = S[k]; S[k] = hd[k]; }
  S.tab.shared = S.hemTab || "cal"; S.space = "hem"; S.view = "shared";
  if (hemLive() && !S.parents[S.uid]) {
    const label = S.stash.parents?.[S.uid]?.label || settings().name;
    if (label) saveDocs("parents", [{label, joinedAt:Date.now()}], S.uid); else meSheet(true);
  }
}
function subscribeHem(db){
  if (S.dbHem === db && S.hemSubscribed) return;
  S.dbHem = db; S.hemSubscribed = true; hemData();
  const docs = snap => snap.docs.map(d => ({id:d.id, ...d.data()}));
  const putHem = (k, v) => { if (S.space === "hem") S[k] = v; else S.hemData[k] = v; render(); };
  db.collection("parents").onSnapshot(s => putHem("parents", Object.fromEntries(s.docs.map(d=>[d.id, d.data()]))));
  for (const [k, path] of [["events","events"],["expenses","expenses"],["payments","payments"],["sharedShop","shop"],["chores","chores"],["swaps","swaps"],["pack","pack"],["handover","handover"]])
    db.collection(path).onSnapshot(s => putHem(k, docs(s)));
  db.collection("notices").where("to","==",S.uid).onSnapshot(s => putHem("notices", docs(s)));
}
// When you are in both Familjen and Hemmet, the days the children live with you are copied to Hemmet,
// so your partner can plan around them without seeing anything else from Familjen.
let lastKidsDays = "";
function syncKidsDays(){
  if (!hemLive() || !HH[settings().household]?.hem) return;
  const t = new Date(), days = [];
  for (let i = -7; i < 120; i++) { const k = ymd(addDays(t, i)); if (famStay(k) === S.uid) days.push(k); }
  const sig = days.join(",");
  if (sig === lastKidsDays) return;
  lastKidsDays = sig;
  S.dbHem.doc("kidsdays/main").set({days, owner:S.uid, updatedAt:Date.now()}).catch(()=>{});
}
function exitHem(){
  if (S.space !== "hem") return;
  for (const k of HEM_KEYS) { S.hemData[k] = S[k]; S[k] = S.stash[k]; }
  S.hemTab = S.tab.shared; S.tab.shared = S.stash.tab; S.space = null; S.stash = {};
}
// live updates for the family while Hemmet is on screen go to the stash, not into Hemmet
const put = (k, v) => { if (S.space === "hem" && HEM_KEYS.includes(k)) S.stash[k] = v; else S[k] = v; render(); };
function famStay(k){
  if (S.kidsDays && !(HH[settings().household]?.stays)) return S.kidsDays.includes(k) ? S.uid : "away";
  if (S.space !== "hem") return stayAt(k);
  const p = S.parents, e = S.events; S.parents = S.stash.parents; S.events = S.stash.events;
  try { return stayAt(k); } finally { S.parents = p; S.events = e; }
}
function hemPartner(){ const ps = S.space === "hem" ? S.parents : hemData().parents; const id = Object.keys(ps || {}).find(x => x !== S.uid); return id ? ps[id].label : ""; }
const parentLabel = id => id === S.uid ? "Du" : (S.parents[id]?.label || cap(H().partner));
const otherLabel = () => otherId() ? parentLabel(otherId()) : cap(H().partner);
const shopShared = () => !!H().sharedShop;
const shopItems = () => shopShared() ? S.sharedShop.map(d => ({...d, _coll:"shop"})) : myShop().map(d => ({...d, _coll:"my"}));
const visibleEvents = () => H().stays ? S.events : S.events.filter(e => e.kind !== "boende");
const otherOf = id => Object.keys(S.parents).find(x => x !== id) || (id === S.uid ? "other" : S.uid);
function stayAt(k){
  const ov = S.events.filter(e => e.kind === "boende" && e.date === k).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0))[0];
  if (ov) return ov.with || null;
  const sc = S.schedule; if (!sc || !sc.start || !PATTERNS[sc.pattern]) return null;
  const diff = Math.round((parseD(k) - parseD(sc.start)) / 86400000); if (diff < 0) return null;
  const cyc = PATTERNS[sc.pattern].cycle;
  const first = sc.first === "other" ? (otherId() || "other") : sc.first;
  return cyc[diff % cyc.length] === "A" ? first : otherOf(first);
}
const stayName = id => id === S.uid ? "dig" : esc(parentLabel(id));
function changeover(k){ const a = stayAt(ymd(addDays(parseD(k),-1))), b = stayAt(k); return a && b && a !== b ? b : null; }
function nextChange(){ const t = new Date(); for (let i = 0; i < 2; i++) { const k = ymd(addDays(t,i)), to = changeover(k); if (to) return {date:k, to}; } return null; }
const shortD = k => parseD(k).toLocaleDateString(LOC,{day:"numeric",month:"short"}).replace(/\.$/, "");
const fmtRange = (a,b) => a === b ? dayLow(a) : `${shortD(a)} – ${shortD(b)}`;
function genRecurring(){
  const out = [], now = ymd(new Date());
  for (const r of S.my.filter(d => d.kind === "recur")) {
    if (!r.start) continue;
    let [y, m] = r.start.split("-").map(Number);
    for (let i = 0; i < 240; i++) {
      const ym = `${y}-${pad(m)}`; if (r.end && ym > r.end) break;
      const date = `${ym}-${pad(Math.min(28, Number(r.day)||1))}`; if (date > now) break;
      out.push({id:`rc_${r.id}_${ym}`, kind:"exp", store:r.name, amount:Number(r.amount)||0, date, category:r.category||"Övrigt", recurring:r.id});
      if (++m > 12) { m = 1; y++; }
    }
  }
  return out;
}
const choresShared = () => shopShared();
const choreItems = () => choresShared() ? S.chores.map(c => ({...c, _coll:"chores"})) : S.my.filter(d => d.kind === "chore").map(c => ({...c, _coll:"my"}));
function personLabel(k){ if (!k || k === "me") return "Du"; if (k.startsWith("u:")) return k.slice(2) === S.uid ? "Du" : parentLabel(k.slice(2)); if (k.startsWith("k:")) return k.slice(2); return k; }
function personOptions(){
  if (choresShared()) return [...Object.keys(S.parents).map(id => ["u:"+id, id===S.uid?"Jag":parentLabel(id)]), ...(H().kids ? S.children.map(c => ["k:"+c.name, c.name]) : [])];
  return [["me","Jag"], ...myKids().map(c => ["k:"+c.name, c.name])];
}
const EVERY = [[1,"Varje dag"],[2,"Varannan dag"],[3,"Var tredje dag"],[7,"Varje vecka"],[14,"Varannan vecka"],[30,"Varje månad"]];
function dueLabel(d){ const t = ymd(new Date()); if (!d) return ""; if (d < t) return "försenad"; if (d === t) return "idag"; const n = Math.round((parseD(d)-parseD(t))/86400000); return n === 1 ? "i morgon" : `om ${n} dagar`; }
const budgetExp = () => [...myExp(), ...genRecurring()];
const kid = id => S.children.find(c => c.id === id);
const kidColor = c => KID_COLORS[(c?.color ?? 0) % KID_COLORS.length];
const myExp = () => S.my.filter(d => d.kind === "exp");
const myEvents = () => S.my.filter(d => d.kind === "event");
const myProjects = () => S.my.filter(d => d.kind === "proj");
const myKids = () => S.my.filter(d => d.kind === "child").sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
const myShop = () => S.my.filter(d => d.kind === "shop");
const myTodos = () => S.my.filter(d => d.kind === "todo");
const allKidNames = () => [...new Set([...myKids(), ...S.children].map(c => c.name))];
const kidByName = n => n ? (myKids().find(c => c.name.toLowerCase() === String(n).toLowerCase()) || S.children.find(c => c.name.toLowerCase() === String(n).toLowerCase())) : null;
const cap = t => String(t||"").trim().replace(/^./, c => c.toUpperCase());
const NO_WARRANTY = ["Hyra & boende","Mat & hushåll","El & värme","Bredband & abonnemang","Barnens aktiviteter","Resor & nöje","Mat","Mat & fika","Transport","Nöje & restaurang","Abonnemang","Aktiviteter & avgifter","Hälsa","Hälsa & tandvård","Skola & förskola"];
const settings = () => S.my.find(d => d.kind === "settings") || {budgets:{}};

/* ---------- demo data (shown only when the app cannot reach its storage) ---------- */
function loadDemo(){
  const t = new Date(), d = n => ymd(addDays(t,n)), m = (mo,day) => { const x = new Date(t.getFullYear(), t.getMonth()-mo, day); return ymd(x); };
  S.uid = "u_me";
  S.parents = {u_me:{label:"Pappa"}, u_other:{label:"Mamma"}};
  S.children = [{id:"c1",name:"Ella",color:0,birth:"2017-03-14",info:{clothes:"134/140",shoes:"33",allergies:"Nötter",health:"Vårdcentralen Solna, BVC: Anna 08-123 456",school:"Råsunda skola, 3B. Lärare: Karin Ek, karin.ek@skola.se",contacts:"Mormor Birgitta 070-765 43 21"},friends:[{name:"Saga",parent:"Johan (pappa)",phone:"070-123 45 67",note:"Bor på Tallvägen 4"},{name:"Ali",parent:"Leyla (mamma)",phone:"073-555 12 34"}],updatedBy:"u_other",updatedAt:Date.now()-86400000*4},{id:"c2",name:"Noah",color:1,birth:"2020-08-02",info:{clothes:"110/116",shoes:"28"}}];
  S.events = [
    {id:"e1",title:"Fotbollsträning",date:d(0),start:"17:30",end:"18:45",kind:"aktivitet",childIds:["c2"],with:"u_me"},
    {id:"e2",title:"Leker hos Saga",date:d(1),start:"14:00",end:"17:00",kind:"lek",childIds:["c1"],with:"",note:"Sagas pappa hämtar från skolan.",friend:{name:"Saga",parent:"Johan (pappa)",phone:"070-123 45 67",note:"Bor på Tallvägen 4"}},
    {id:"e4",title:"Tandläkare",date:d(4),start:"08:15",end:"09:00",kind:"annat",childIds:["c1"],with:"u_other"},
    {id:"e5",title:"Simskola",date:d(6),start:"10:00",end:"10:45",kind:"aktivitet",childIds:["c1","c2"],with:"u_me"}
  ];
  S.expenses = [
    {id:"x1",store:"H&M",amount:398,date:d(-2),category:"Kläder",childIds:["c1"],split:50,paidBy:"u_me",items:[{name:"Tröja",price:199},{name:"Leggings",price:199}]},
    {id:"x2",store:"Stadium",amount:899,date:d(-9),category:"Skor",childIds:["c2"],split:50,paidBy:"u_other"},
    {id:"x3",store:"Simklubben",amount:1200,date:d(-20),category:"Aktiviteter & avgifter",childIds:["c1","c2"],split:50,paidBy:"u_me"}
  ];
  S.payments = [{id:"p1",from:"u_other",to:"u_me",amount:300,date:d(-15)}];
  const mon = addDays(t, -((t.getDay()+6)%7));
  S.schedule = {pattern:"vv", start:ymd(addDays(mon,-7)), first:"u_me"};
  S.swaps = [{id:"sw1",from:"u_other",to:"u_me",start:d(9),end:d(9),toParent:"u_me",note:"Jag har en kurs den kvällen.",status:"pending",createdAt:Date.now()-3600000}];
  S.handover = [{id:"h1",from:"u_other",to:"u_me",date:d(0),text:"Noah har varit lite förkyld, fick Alvedon kl 14. Ella har läxa till torsdag (glosor).",read:false,createdAt:Date.now()-7200000}];
  S.swaps.push({id:"lv1",name:"Jullov",from:"u_me",to:"u_other",start:`${t.getFullYear()}-12-22`,end:`${t.getFullYear()}-12-27`,toParent:"u_me",status:"accepted",createdAt:1},{id:"lv2",name:"Nyår",from:"u_me",to:"u_other",start:`${t.getFullYear()}-12-28`,end:`${t.getFullYear()+1}-01-02`,toParent:"u_other",status:"pending",createdAt:2});
  S.chores = [{id:"ch1",name:"Dammsuga",every:7,people:["u:u_me","u:u_other"],idx:0,due:d(0)},{id:"ch2",name:"Tömma diskmaskinen",every:1,people:["k:Ella","k:Noah"],idx:1,due:d(0)}];
  S.pack = [{id:"pk1",text:"Gympapåse",done:true,createdAt:1},{id:"pk2",text:"Laddare till surfplattan",done:false,createdAt:2},{id:"pk3",text:"Gosedjuret Nalle",childName:"Noah",done:false,createdAt:3},{id:"pk4",text:"Läxböcker",done:false,createdAt:4}];
  S.notices = [{id:"n1",to:"u_me",from:"u_other",text:"Mamma lade in Stadium 899 kr för Noah. Din del: 450 kr.",read:false,createdAt:Date.now()-86400000*9}];
  const cats = [["Mat",[4200,3900,4600,4100,4400,3800,4700,4300,4050,4500,4800,4350]],["Hem",[600,350,900,1200,300,450,800,200,650,1500,400,700]],["Transport",[900,900,950,900,1100,900,900,1000,900,950,900,920]],["Nöje & restaurang",[700,400,1200,500,900,1300,1500,600,800,450,700,1100]],["Abonnemang",[650,650,650,650,650,650,650,650,650,650,650,650]]];
  const my = []; let k = 0;
  for (let mo = 0; mo < 22; mo++) for (const [c,arr] of cats) {
    const base = arr[(t.getMonth()-mo+240)%12] * (mo>=12?0.93:1);
    my.push({id:"d"+(k++),kind:"exp",store:{Mat:"ICA Kvantum",Hem:"IKEA",Transport:"SL",["Nöje & restaurang"]:"Restaurang",Abonnemang:"Telia"}[c],amount:Math.round(base),date:m(mo, mo===0?Math.min(t.getDate(),8):12),category:c});
  }
  my.push({id:"pr1",kind:"proj",name:"Badrumsrenovering",budget:85000,start:m(3,1),status:"active"});
  my.push({id:"d900",kind:"exp",store:"Bauhaus",amount:18450,date:m(2,6),category:"Renovering",project:"pr1",items:[{name:"Kakel 20 m²",price:12900},{name:"Fix & fog",price:5550}]});
  my.push({id:"d901",kind:"exp",store:"Hantverkare – rörmokare",amount:32000,date:m(1,18),category:"Renovering",project:"pr1"});
  my.push({id:"d902",kind:"exp",store:"Byggmax",amount:4120,date:m(0,3),category:"Renovering",project:"pr1"});
  my.push({id:"ev1",kind:"event",title:"Padel med Johan",date:d(1),start:"19:00",end:"20:30"});
  my.push({id:"ev2",kind:"event",title:"Läkartid",date:d(3),start:"09:30",end:"10:00"});
  my.push({id:"k1",kind:"child",name:"Ella",color:0,createdAt:1},{id:"k2",kind:"child",name:"Noah",color:1,createdAt:2});
  my.push({id:"s1",kind:"shop",text:"Mjölk",group:"mat",done:false,createdAt:3},{id:"s2",kind:"shop",text:"Ny vinterjacka",childName:"Ella",group:"ovrigt",done:false,createdAt:4},{id:"s3",kind:"shop",text:"Kaffe",group:"mat",done:true,createdAt:5});
  my.push({id:"t1",kind:"todo",text:"Anmäla Noah till simskolan",childName:"Noah",due:d(3),done:false,createdAt:6},{id:"t2",kind:"todo",text:"Byta vinterdäck",due:d(6),done:false,createdAt:7});
  my.push({id:"tv1",kind:"exp",store:"Elgiganten",amount:8990,date:m(14,20),category:"Hem",items:[{name:"Samsung 55\" TV",price:8990}],warrantyYears:3,warrantyUntil:m(-22,20)});
  S.sharedShop = [{id:"ss1",text:"Toapapper",group:"mat",done:false,createdAt:1},{id:"ss2",text:"Diskmedel",group:"mat",done:false,createdAt:2}];
  my.push({id:"rc1",kind:"recur",name:"Hyra",amount:9200,category:"Boende",day:27,start:m(18,1).slice(0,7)},{id:"rc2",kind:"recur",name:"Hemförsäkring",amount:189,category:"Försäkringar",day:1,start:m(18,1).slice(0,7)});
  my.push({id:"g1",kind:"goal",name:"Resa till Kreta",target:15000,saved:6200,deadline:`${t.getFullYear()+1}-06-01`,history:[{amount:2000,date:m(3,25)},{amount:2000,date:m(2,25)},{amount:2200,date:m(1,25)}]});
  my.push({id:"chm1",kind:"chore",name:"Byta lakan",every:14,people:["me"],idx:0,due:d(2)},{id:"chm2",kind:"chore",name:"Duka av efter middagen",every:1,people:["k:Ella","k:Noah"],idx:0,due:d(0)});
  my.push({id:"settings",kind:"settings",household:"separerad",budgets:{Mat:4500,Hem:1000,"Nöje & restaurang":800}});
  S.my = my;
}

/* ---------- render ---------- */
function render(){
  const app = $("#app");
  const keep = {}; const act = document.activeElement;
  app.querySelectorAll("[data-keep]").forEach(el => keep[el.id] = el.value);
  const focusId = act && app.contains(act) && act.id ? act.id : null, selS = focusId ? act.selectionStart : null;
  app.className = "app" + (S.view === "mine" ? " mine" : S.space === "hem" ? " hem" : "");
  if (S.view === "shared" && !H().shared) S.view = "home";
  if (S.view === "home") app.innerHTML = renderHome();
  else if (S.view === "shared") app.innerHTML = renderShared();
  else app.innerHTML = renderMine();
  for (const [id,v] of Object.entries(keep)) { const el = document.getElementById(id); if (el && v) el.value = v; }
  const f = S.refocus || focusId; S.refocus = null;
  if (f) { const el = document.getElementById(f); if (el) { el.focus({preventScroll:true}); try { if (selS!=null && el.setSelectionRange) el.setSelectionRange(selS, selS); } catch(e){} } }
  renderChrome();
}
function topBar(title, sub, extra){
  const unread = S.notices.filter(n => n.to === S.uid && !n.read).length;
  const bell = H().shared ? `<button class="iconbtn" data-act="notices" aria-label="Notiser">${IC.bell}${unread ? `<span class="badge num">${unread}</span>` : ""}</button>` : "";
  return `<div class="top">
    ${S.view !== "home" ? `<button class="iconbtn" data-act="go" data-v="home" aria-label="Till startsidan">${IC.home}</button>` : ""}
    <div class="title">${title}${sub ? `<small>${sub}</small>` : ""}</div><div class="spacer"></div>${extra||""}
    ${bell}
  </div>${modeBanner()}`;
}
function modeBanner(){
  if (S.space === "hem" && !hemLive()) return `<div class="banner"><b>Förhandsvisning med exempeldata.</b> Så här kommer Hemmet med en ny partner att fungera. Ditt ex ser aldrig Hemmet, och din partner ser aldrig Familjen. I testversionen sparas inget här, eftersom alla som bjuds in till appen kan läsa allt som delas i den. Det kräver den riktiga appen.</div>`;
  if (S.mode === "demo") return S.ready ? `<div class="banner row" style="flex-wrap:wrap"><span style="flex:1;min-width:180px"><b>Exempeldata.</b> Du tittar runt utan konto, och inget sparas.</span><button class="btn" style="padding:6px 10px;font-size:13px" data-act="login">Logga in</button></div>` : "";
  if (!S.canWrite) return `<div class="banner">Du kan bara läsa. Be den som skapade appen att dela den med dig som <b>Redigerare</b>.</div>`;
  return "";
}

function balance(){
  // positive = the other parent owes me
  let net = 0;
  for (const e of S.expenses) {
    const share = (Number(e.amount)||0) * (e.split ?? 50) / 100;
    if (e.paidBy === S.uid) net += share; else net -= share;
  }
  for (const p of S.payments) { if (p.from === S.uid) net += Number(p.amount)||0; if (p.to === S.uid) net -= Number(p.amount)||0; }
  return Math.round(net);
}
function balanceText(){
  const b = balance(), o = otherLabel();
  if (Math.abs(b) < 1) return "Ni är kvitt";
  return b > 0 ? `${esc(o)} är skyldig dig ${fmtKr(b)}` : `Du är skyldig ${esc(o)} ${fmtKr(-b)}`;
}

function renderHome(){
  const t = new Date(), today = ymd(t), weekEnd = ymd(addDays(t,7));
  const wk = visibleEvents().filter(e => e.date >= today && e.date < weekEnd).length;
  const mo = budgetExp().filter(e => e.date.slice(0,7) === today.slice(0,7)).reduce((a,e)=>a+Number(e.amount||0),0);
  const upcoming = [...(H().shared ? visibleEvents() : []).map(e=>({...e,_s:"shared"})), ...myEvents().map(e=>({...e,_s:"mine"}))]
    .filter(e => e.date >= today && e.date <= ymd(addDays(t,1))).sort(evSort);
  const name = S.parents[S.uid]?.label || settings().name;
  const h = H();
  const openShop = shopItems().filter(x=>!x.done).length, openTodo = myTodos().filter(x=>!x.done);
  const dueSoon = openTodo.filter(x=>x.due && x.due <= ymd(addDays(t,1))).length;
  const ch = choreItems(), choresNow = ch.filter(c => c.due && c.due <= today);
  const showHints = hintUses() < 3;
  const famBox = h.shared && h.kids;
  const attention = homeFamilyCards();
  const row = (act, icon, title, sub) => `<button class="item" data-act="${act}"><div class="cat-ic" style="background:var(--mine-soft);color:var(--mine)">${icon.replace('<svg','<svg width="20" height="20"')}</div><div class="main"><div class="t">${title}</div><div class="s">${sub}</div></div>${IC.right.replace('<svg','<svg width="18" height="18" style="color:var(--ink-3)"')}</button>`;
  return `${topBar(`Hej${name ? " " + esc(name) : ""}`, t.toLocaleDateString(LOC,{weekday:"long",day:"numeric",month:"long"}), GEAR)}
  <div class="doors${h.shared?(hasHem()?" three":""):" single"}">
    ${h.shared?`<button class="door shared" data-act="go" data-v="shared"><div class="ic">${IC[h.icon]}</div><b>${h.space}</b>
      <span>Delas med ${esc(otherLabel())}</span><span>${wk} händelser i veckan · ${balanceText()}</span></button>`:""}
    ${hasHem()?`<button class="door hem" data-act="goHem"><div class="ic">${IC.home}</div><b>Hemmet</b>
      <span>${hemPartner() ? `Delas med ${esc(hemPartner())}` : "Ditt hem med din partner"}</span><span>${S.mode === "live" ? (hemPartner() ? "Ditt hem med din partner" : "Bjud in din partner") : "Ditt hem med din partner · förhandsvisning"}</span></button>`:""}
    <button class="door mine" data-act="go" data-v="mine"><div class="ic">${IC.me}</div><b>Mitt</b>
      <span>Bara du ser detta</span><span>${MONTHS[t.getMonth()].replace(/^./,c=>c.toUpperCase())}: ${fmtKr(mo)}</span></button>
  </div>
  ${attention ? `<div class="section"><span class="eyebrow">Att ta hand om</span><div class="stack" style="margin-top:8px">${attention}</div></div>` : ""}
  <div class="section"><span class="eyebrow">Lägg till snabbt</span>
    <div class="boxlabel" style="margin-top:8px"><span class="dot" style="background:var(--mine)"></span>Listor och din egen kalender</div>
    <form class="cmd" data-form="cmd" style="margin-top:6px"><input id="cmd-in" data-keep name="q" autocomplete="off" enterkeyhint="send" aria-label="Lägg till i listor eller din kalender" placeholder="T.ex. mjölk på inköpslistan"><button type="submit" aria-label="Lägg till">${IC.send}</button></form>
    <div id="cmd-status" class="result" ${S.cmdMsg?"":"hidden"}>${S.cmdMsg||""}</div>
    ${showHints ? `<div class="hints">${["Mjölk och bröd på inköpslistan", "Padel på torsdag kl 19"].map(x=>`<button class="hint" type="button" data-act="hint" data-to="cmd-in" data-h="${esc(x)}">${esc(x)}</button>`).join("")}</div>` : ""}
    ${famBox ? `<div class="boxlabel"><span class="dot" style="background:var(--shared)"></span>${h.space}s kalender – syns för ${esc(otherLabel())} också</div>
    <form class="cmd fam" data-form="calcmd" style="margin-top:6px"><input id="cal-in" data-keep name="q" autocomplete="off" enterkeyhint="send" aria-label="Lägg in i ${h.space.toLowerCase()}s kalender" placeholder="T.ex. ${esc(S.children[0]?.name||"Ella")} leker med ${esc(S.children.flatMap(c=>c.friends||[])[0]?.name||"Saga")} 15 okt kl 14"><button type="submit" aria-label="Lägg in i kalendern">${IC.cal}</button></form>
    <div id="cal-status" class="result" ${S.calMsg?"":"hidden"}>${S.calMsg||""}</div>` : ""}
  </div>
  <div class="section"><span class="eyebrow">Idag och i morgon</span>
    <div class="list" style="margin-top:8px">${upcoming.length ? upcoming.map(e => eventItem(e, e._s, true)).join("") : `<div class="empty">Inget inplanerat. Skriv t.ex. "padel på torsdag kl 19" ovan.</div>`}</div></div>
  <div class="section"><span class="eyebrow">Listor</span><div class="list" style="margin-top:8px">
    ${canAct() ? row("dinner", IC.send, "Middagstips med AI", "Få förslag på rätter och lägg ingredienserna på inköpslistan") : ""}
    ${row("goLists", IC.list, "Inköpslista", `${openShop ? openShop + " saker att handla" : "Tom"}${shopShared()?` · delas med ${esc(otherLabel())}`:""}`)}
    ${row("goLists", IC.check, "Att göra", openTodo.length ? openTodo.length + " kvar" + (dueSoon ? ` · ${dueSoon} idag eller i morgon` : "") : "Allt klart")}
    ${row("goChores", IC.swish, "Sysslor", ch.length ? (choresNow.length ? choresNow.slice(0,3).map(c=>`${esc(tr(c.name))} (${esc(tr(personLabel(c.people?.[c.idx||0])))})`).join(", ") + (choresNow.length>3?" …":"") : "Inget idag") : "Turas om med städning, disk och sopor")}
  </div></div>`;
}
const GEAR = `<button class="iconbtn" data-act="setup" aria-label="Inställningar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>`;
function hintUses(){ try { return Number(localStorage.getItem("vardagen.hints")||0); } catch(e) { return 0; } }
function countHint(){ try { localStorage.setItem("vardagen.hints", String(hintUses()+1)); } catch(e) {} }
function homeFamilyCards(){
  if (!H().shared) return "";
  const unread = S.notices.filter(n => n.to === S.uid && !n.read).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  const noticeBox = unread.length ? `<button class="card" style="width:100%;text-align:left;display:flex;gap:12px;align-items:center" data-act="notices"><div class="cat-ic" style="background:var(--shared-soft);color:var(--shared)">${IC.bell.replace('<svg','<svg width="20" height="20"')}</div><div style="flex:1;min-width:0"><b>${unread.length === 1 ? "1 ny notis" : unread.length + " nya notiser"}</b><div class="small muted" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(unread[0].text)}</div></div></button>` : "";
  if (!H().stays) return noticeBox;
  const reqs = S.swaps.filter(x => x.to === S.uid && x.status === "pending");
  const nc = nextChange();
  const packDone = S.pack.filter(x=>x.done).length;
  return `${reqs.map(swapCard).join("")}
    ${S.handover.filter(x => x.to === S.uid && !x.read).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).map(x => handoverCard(x, true)).join("")}
    ${nc ? `<div class="card stack" style="gap:10px"><button style="all:unset;cursor:pointer;display:flex;gap:12px;align-items:center" data-act="goPack"><div class="cat-ic" style="background:var(--shared-soft);color:var(--shared)">${IC.swish.replace('<svg','<svg width="20" height="20"')}</div><div style="flex:1"><b>Byte ${dayLow(nc.date)}</b><div class="small muted">Barnen går till ${stayName(nc.to)}${S.pack.length ? ` · packlista ${packDone} av ${S.pack.length} klar` : ""}</div></div></button>
      ${canAct() && otherId() !== null || S.mode==="demo" ? `<button class="btn" data-act="handover" data-d="${nc.date}">Skriv en hälsning till ${esc(otherLabel())}</button>` : ""}</div>` : ""}
    ${noticeBox}`.trim();
}
function handoverCard(x, actions){
  const mine = x.from === S.uid;
  return `<div class="note-card"><div class="row"><span class="eyebrow" style="flex:1">${mine ? `Din hälsning till ${esc(parentLabel(x.to))}` : `Hälsning från ${esc(parentLabel(x.from))}`} · ${dayLow(x.date)}</span>${mine ? `<span class="status ${x.read?"ok":"wait"}">${x.read?"Läst":"Inte läst än"}</span>` : ""}</div>
    <p>${esc(x.text)}</p>${actions && !mine && canAct() ? `<div><button class="btn" data-act="handoverRead" data-id="${esc(x.id)}">${IC.check.replace('<svg','<svg width="16" height="16"')} Tack, läst</button></div>` : ""}</div>`;
}
function swapCard(x){
  const mine = x.from === S.uid;
  const pre = x.name ? `${esc(x.name)}: ` : "";
  const txt = pre + (mine ? `Du har frågat ${esc(parentLabel(x.to))} om barnen kan vara hos ${x.toParent===S.uid?"mig":esc(parentLabel(x.toParent))} ${fmtRange(x.start,x.end)}.`
    : `${esc(parentLabel(x.from))} undrar om barnen kan vara hos ${x.toParent===S.uid?"dig":esc(parentLabel(x.toParent))} ${fmtRange(x.start,x.end)}.`);
  return `<div class="swap" style="--accent:var(--shared);--accent-soft:var(--shared-soft)"><div><span class="eyebrow">${mine?"Väntar på svar":x.name?`Förfrågan om ${esc(x.name.toLowerCase())}`:"Förfrågan om byte"}</span><div style="margin-top:4px;font-weight:600">${txt}</div>${x.note?`<div class="small muted" style="margin-top:4px">"${esc(x.note)}"</div>`:""}</div>
    ${mine ? (canAct()?`<div><button class="btn" data-act="swapCancel" data-id="${esc(x.id)}">Ta tillbaka</button></div>`:"") : (canAct()?`<div class="btnrow"><button class="btn primary" data-act="swapYes" data-id="${esc(x.id)}">Ja, det går bra</button><button class="btn" data-act="swapNo" data-id="${esc(x.id)}">Nej</button></div>`:"")}</div>`;
}
function evSort(a,b){ return (a.date+(a.start||"00:00")).localeCompare(b.date+(b.start||"00:00")); }
function eventItem(e, scope, showDay){
  const kids = (e.childIds||[]).map(kid).filter(Boolean);
  const dot = scope === "mine" ? `<span class="dot" style="background:var(--mine)"></span>` :
    `<span class="row" style="gap:2px">${(kids.length?kids:[null]).map(c=>`<span class="dot" style="background:${c?kidColor(c):"var(--shared)"}"></span>`).join("")}</span>`;
  const sub = [];
  if (showDay) sub.push(dayLabel(e.date));
  if (scope === "shared" && S.view === "mine") sub.push(H().space);
  if (scope === "shared") {
    if (kids.length && H().kids) sub.push(kids.map(c=>esc(c.name)).join(" & "));
    if (e.friend?.name) sub.push(`med ${esc(e.friend.name)}${e.friend.phone ? ` · ${e.friend.parent ? esc(e.friend.parent.split(" (")[0]) + " " : ""}<span class="phone">${esc(e.friend.phone)}</span>` : ""}`);
    if (e.with) sub.push((e.kind==="boende"?"hos ":"ansvar: ") + esc(parentLabel(e.with)));
  } else if (scope === "mine" && S.view !== "mine") sub.push("Privat");
  return `<button class="item" data-act="openEvent" data-id="${esc(e.id)}" data-scope="${scope}">
    <div class="timebox">${e.start ? esc(e.start) : "Heldag"}</div>${dot}
    <div class="main"><div class="t">${esc(e.title)}</div><div class="s">${sub.join(" · ")}${e.kind && scope==="shared" ? ` · ${esc(KINDS[e.kind]||"")}` : ""}</div></div></button>`;
}
function noticeItem(n){
  const d = new Date(n.createdAt||Date.now());
  return `<div class="item"><span class="dot" style="background:${n.read?"var(--line)":"var(--crit)"}"></span><div class="main"><div style="font-weight:${n.read?400:600}">${esc(n.text)}</div><div class="s">${d.toLocaleDateString(LOC,{day:"numeric",month:"short"})}</div></div></div>`;
}

/* ----- calendar ----- */
function renderCalendar(scope, events){
  const m = S.calMonth[scope], sel = S.selDay[scope], today = ymd(new Date());
  const showStay = H().stays && H().shared && (scope === "shared" || S.showSharedInMine);
  const hemStay = scope === "shared" && ((S.space === "hem" && !!S.schedule?.pattern) || (!H().stays && !!S.kidsDays?.length));
  const start = addDays(m, -((m.getDay()+6)%7));
  const byDay = {};
  for (const e of events) (byDay[e.date] ||= []).push(e);
  let cells = "";
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i), k = ymd(d), evs = byDay[k] || [];
    if (i === 35 && d.getMonth() !== m.getMonth()) break;
    const stay = showStay ? stayAt(k) : hemStay ? (famStay(k) === S.uid ? S.uid : null) : null;
    const dots = evs.filter(e => e.kind !== "boende").slice(0,4).map(e => {
      if (e._s === "mine" || scope === "mine" && !e._s) return `<i style="background:var(--mine)"></i>`;
      const c = kid((e.childIds||[])[0]); return `<i style="background:${c?kidColor(c):"var(--shared)"}"></i>`;
    }).join("");
    cells += `<button class="cal-day${d.getMonth()!==m.getMonth()?" out":""}${k===today?" today":""}" data-act="selDay" data-scope="${scope}" data-d="${k}" aria-pressed="${k===sel}" aria-label="${k}">
      <span class="n">${d.getDate()}</span><span class="dots">${dots}</span>${stay?`<span class="stayband" style="background:${stay===S.uid?"var(--accent)":"var(--ink-3)"}"></span>`:""}</button>`;
  }
  const dayEvs = (byDay[sel]||[]).filter(e => e.kind !== "boende" || !showStay).sort(evSort);
  const who = showStay ? stayAt(sel) : null, co = showStay ? changeover(sel) : null;
  const hemWho = hemStay ? famStay(sel) : null;
  const stayLine = hemStay ? `<div class="item"><span class="stayband" style="width:22px;flex:none;background:${hemWho===S.uid?"var(--accent)":"var(--line)"}"></span><div class="main"><div class="t">${hemWho===S.uid ? "Barnen bor hos er" : "Barnen är hos andra föräldern"}</div><div class="s">Från Familjens boendeschema · bara läsning</div></div></div>` : showStay ? `<div class="item"><span class="stayband" style="width:22px;flex:none;background:${who===S.uid?"var(--accent)":who?"var(--ink-3)":"var(--line)"}"></span><div class="main"><div class="t">${who ? `Barnen är hos ${stayName(who)}` : "Inget boendeschema"}</div><div class="s">${co ? "Byte den här dagen" : who ? "Enligt schemat" : "Lägg in ert schema så fylls kalendern i"}</div></div>
    ${scope==="shared" && canAct() ? (who ? `<button class="btn" style="padding:6px 10px;font-size:13px" data-act="swapReq" data-d="${sel}">Be om byte</button>` : `<button class="btn" style="padding:6px 10px;font-size:13px" data-act="schedule">Lägg in schema</button>`) : ""}</div>` : "";
  return `<div class="cal"><div class="cal-head"><button class="iconbtn" data-act="calNav" data-scope="${scope}" data-n="-1" aria-label="Föregående månad">${IC.left}</button>
    <h2>${MONTHS[m.getMonth()]} ${m.getFullYear()}</h2>
    <button class="iconbtn" data-act="calNav" data-scope="${scope}" data-n="1" aria-label="Nästa månad">${IC.right}</button></div>
    <div class="cal-grid">${DOW.map(d=>`<div class="cal-dow">${d}</div>`).join("")}${cells}</div></div>
  <div class="section"><div class="row" style="margin-bottom:8px"><span class="eyebrow">${dayLabel(sel)}</span><div class="spacer"></div>
    ${canAct()?`<button class="btn" data-act="newEvent" data-scope="${scope}">${IC.plus} Händelse</button>`:""}</div>
    <div class="list">${stayLine}${dayEvs.length ? dayEvs.map(e => eventItem(e, e._s || scope, false)).join("") : stayLine ? "" : `<div class="empty">Inget den här dagen.</div>`}</div></div>`;
}
const canAct = () => S.mode === "demo" || S.canWrite;

/* ----- shared space ----- */
function renderShared(){
  const tab = S.tab.shared;
  let body = "";
  if (H().kids && !S.children.length && S.mode === "live" && tab === "cal") body = `<div class="card stack" style="margin-top:12px"><h2>Börja med barnen</h2><p class="muted" style="margin:0">Lägg till barnens namn så kan ni koppla händelser och kvitton till dem.</p><button class="btn primary" data-act="tab" data-t="kids">Lägg till barn</button></div>`;
  if (tab === "cal") {
    const evs = visibleEvents().filter(e => !S.kidFilter || (e.childIds||[]).includes(S.kidFilter));
    body += `${H().kids && S.children.length>1?`<div class="chips" style="margin:6px 0 12px"><button class="chip" data-act="kidFilter" data-id="" aria-pressed="${!S.kidFilter}">Alla</button>${S.children.map(c=>`<button class="chip" data-act="kidFilter" data-id="${esc(c.id)}" aria-pressed="${S.kidFilter===c.id}"><span class="dot" style="background:${kidColor(c)}"></span>${esc(c.name)}</button>`).join("")}</div>`:""}
      ${H().stays ? `${S.swaps.filter(x=>x.status==="pending" && (x.to===S.uid || (x.from===S.uid && !x.name))).map(x=>`<div style="margin-bottom:12px">${swapCard(x)}</div>`).join("")}
` : ""}
      ${renderCalendar("shared", evs)}
      ${H().stays?`<div class="card row" style="margin-top:16px;flex-wrap:wrap"><div style="flex:1;min-width:200px"><b class="small">${S.schedule?.pattern ? `Boendeschema: ${PATTERNS[S.schedule.pattern]?.label}` : "Inget boendeschema än"}</b><div class="small muted">Strecket under datumen visar var barnen bor: färgat = hos dig, grått = hos ${esc(otherLabel())}.</div></div>${canAct()?`<button class="btn" data-act="schedule">${S.schedule?.pattern?"Ändra":"Lägg in schema"}</button>`:""}</div>`:""}`;
  } else if (tab === "money") body += renderSharedMoney();
  else if (tab === "shop") body += `<p class="small muted" style="margin:6px 0 0">Ni ser och bockar av samma lista. Den finns också under Listor i Mitt.</p>${shopBlock()}`;
  else if (tab === "lov") body += renderLov();
  else if (tab === "chores") body += `<p class="small muted" style="margin:6px 0 0">Turordningen går runt automatiskt när någon bockar av.</p>${choresBlock()}`;
  else body += renderKids();
  return topBar(H().space, `Gemensamt med ${esc(otherLabel())}${S.space === "hem" ? " · exempel" : ""}`) + body;
}
function renderSharedMoney(){
  const b = balance(), o = otherLabel(), yr = String(new Date().getFullYear());
  const list = [...S.expenses].sort((a,b)=>b.date.localeCompare(a.date));
  const perKid = S.children.map(c => ({c, sum: S.expenses.filter(e => e.date.startsWith(yr) && (e.childIds||[]).includes(c.id)).reduce((a,e)=>a+Number(e.amount)/(e.childIds.length||1),0)}));
  const maxK = Math.max(1,...perKid.map(p=>p.sum));
  const hist = [...list.map(e=>({...e,_t:"e"})), ...S.payments.map(p=>({...p,_t:"p"}))].sort((a,b)=>b.date.localeCompare(a.date));
  return `<div class="balance stack" style="margin-top:8px;${S.space==="hem"?"--accent:#8A5A12":"--accent:#0D7463"}">
    <span class="eyebrow" style="color:rgba(255,255,255,.8)">Att jämna ut</span>
    <div class="big num">${Math.abs(b)<1 ? "0 kr" : fmtKr(Math.abs(b))}</div>
    <div class="muted">${balanceText()}</div>
    ${Math.abs(b)>=1 && canAct() ? `<div><button class="btn" data-act="pay">${IC.swish} ${b<0?`Jag har betalat ${esc(o)}`:`${esc(o)} har betalat mig`}</button></div>`:""}
  </div>
  ${canAct()?`<div class="btnrow" style="margin-top:12px"><button class="btn primary" data-act="scan" data-scope="shared">${IC.camera} Skanna kvitto</button><button class="btn" data-act="manual" data-scope="shared">Skriv in utan kvitto</button></div>`:""}
  ${perKid.length && H().kids?`<div class="section"><span class="eyebrow">Lagt per barn ${yr}</span><div class="card bars">${perKid.map(p=>`<div class="bar-row"><div class="lab"><span class="row" style="gap:6px"><span class="dot" style="background:${kidColor(p.c)}"></span>${esc(p.c.name)}</span><b>${fmtKr(p.sum)}</b></div><div class="track"><div class="fill" style="width:${p.sum/maxK*100}%;background:${kidColor(p.c)}"></div></div></div>`).join("")}</div></div>`:""}
  <div class="section"><span class="eyebrow">Kvitton och betalningar</span><div class="list">${hist.length ? hist.map(x => x._t==="e" ? expenseItem(x,"shared") : paymentItem(x)).join("") : `<div class="empty">Inga kvitton än. Fota ett kvitto så räknar appen ut vem som ska betala vad.</div>`}</div></div>`;
}
function expenseItem(e, scope, archive){
  let sub = dayLabel(e.date).replace(/^Idag$/,"Idag") + " · " + esc(e.category||"");
  let right = fmtKr(e.amount);
  if (scope === "shared") {
    const kids = (e.childIds||[]).map(kid).filter(Boolean).map(c=>esc(c.name)).join(" & ");
    const share = Number(e.amount)*(e.split??50)/100;
    sub = `${esc(parentLabel(e.paidBy))} betalade${kids?" · "+kids:""} · ${dayLabel(e.date)}`;
    right = `${fmtKr(e.amount)}<div class="s" style="font-weight:500">${e.split===0?"ingen delning":(e.paidBy===S.uid?"får ":"din del ")+fmtKr(share)}</div>`;
  } else if (e.project) { const p = myProjects().find(p=>p.id===e.project); if (p) sub += " · " + esc(p.name); }
  if (archive) { sub = `${parseD(e.date).toLocaleDateString(LOC,{day:"numeric",month:"short",year:"numeric"})} · ${scope==="shared"?H().space:"Mitt"}`;
    if (e.warrantyUntil) sub += e.warrantyUntil >= ymd(new Date()) ? ` · <b>reklamation t.o.m. ${esc(e.warrantyUntil)}</b>` : ` · reklamationstiden slut`; right = fmtKr(e.amount); }
  const img = e.receipt ? `<img class="thumb" src="${esc(e.receipt)}" alt="">` : `<div class="cat-ic"${scope==="shared"?(S.space==="hem"?' style="background:var(--hem-soft);color:var(--hem)"':' style="background:var(--shared-soft);color:var(--shared)"'):""}>${esc((e.store||"?").slice(0,1).toUpperCase())}</div>`;
  if (e.recurring) sub += " · fast kostnad";
  const act = e.recurring ? `data-act="recurEdit" data-id="${esc(e.recurring)}"` : `data-act="openExp" data-id="${esc(e.id)}" data-scope="${scope}"`;
  return `<button class="item" ${act}>${img}<div class="main"><div class="t">${esc(e.store||"Utan namn")}${e.imgId||e.receipt?` <span class="clip" title="Kvittobild sparad">${IC.clip}</span>`:""}</div><div class="s">${sub}</div></div><div class="amt" style="text-align:right">${right}</div></button>`;
}
function paymentItem(p){
  return `<div class="item"><div class="cat-ic">${IC.swish.replace('<svg','<svg width="20" height="20"')}</div><div class="main"><div class="t">${esc(parentLabel(p.from))} betalade ${p.to===S.uid?"dig":esc(parentLabel(p.to))}</div><div class="s">${dayLabel(p.date)}</div></div><div class="amt">${fmtKr(p.amount)}</div></div>`;
}
function age(b){ const d = parseD(b), t = new Date(); let a = t.getFullYear()-d.getFullYear(); if (t.getMonth()<d.getMonth() || (t.getMonth()===d.getMonth() && t.getDate()<d.getDate())) a--; return a; }
function packSection(){
  const items = [...S.pack].sort((a,b)=>(a.createdAt||0)-(b.createdAt||0)).map(d=>({...d,_coll:"pack"}));
  const done = items.filter(x=>x.done).length, nc = nextChange();
  return `<div class="section" id="pack"><div class="row" style="margin-bottom:8px"><span class="eyebrow">Packlista vid byte</span><div class="spacer"></div>${done && canAct()?`<button class="btn" style="padding:6px 10px;font-size:13px" data-act="packReset">Avbocka allt</button>`:""}</div>
    <p class="small muted" style="margin:0 0 8px">Saker som ska följa med mellan hemmen. Ni ser samma lista.${nc?` <b>Nästa byte: ${dayLow(nc.date)}.</b>`:""}</p>
    <div class="list">${items.length ? items.map(listItem).join("") : `<div class="empty">Ex. gympapåse, laddare, gosedjur.</div>`}
    ${canAct()?`<form class="addrow" data-form="add" data-kind="pack"><input id="add-pack" data-keep name="text" maxlength="60" autocomplete="off" placeholder="Lägg till sak" aria-label="Packlista: ny sak"><button class="btn primary" type="submit" aria-label="Lägg till">${IC.plus}</button></form>`:""}</div></div>`;
}
function renderKids(){
  const parents = Object.entries(S.parents);
  const h = H();
  return `${h.kids?`<div class="section" style="margin-top:8px"><div class="row" style="margin-bottom:8px"><span class="eyebrow">Barnen</span><div class="spacer"></div>${canAct()?`<button class="btn" data-act="editKid">${IC.plus} Lägg till barn</button>`:""}</div>
    <div class="list">${S.children.length ? S.children.map(c=>{ const n = Object.values(c.info||{}).filter(Boolean).length;
      const n2 = n + (c.friends?.length||0);
      return `<button class="item" data-act="kidCard" data-id="${esc(c.id)}"><span class="dot" style="background:${kidColor(c)};width:14px;height:14px"></span><div class="main"><div class="t">${esc(c.name)}${c.birth?` <span class="muted" style="font-weight:400">· ${age(c.birth)} år</span>`:""}</div><div class="s">${n2 ? `Barnkort: ${[c.info?.clothes&&"strl "+esc(c.info.clothes), c.info?.shoes&&"skor "+esc(c.info.shoes), c.info?.allergies&&"allergi", c.friends?.length&&c.friends.length+(c.friends.length===1?" kompis":" kompisar")].filter(Boolean).join(" · ") || n+" uppgifter"}` : "Tryck för att fylla i barnkortet"}</div></div>${IC.right.replace('<svg','<svg width="18" height="18" style="color:var(--ink-3)"')}</button>`; }).join("") : `<div class="empty">Inga barn tillagda än.</div>`}</div></div>`:""}
  ${h.stays ? packSection() : ""}
  ${h.stays ? (() => { const hs = [...S.handover].sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,8);
    return `<div class="section"><div class="row" style="margin-bottom:8px"><span class="eyebrow" style="flex:1">Hälsningar vid byte</span>${canAct()?`<button class="btn" style="padding:6px 10px;font-size:13px" data-act="handover">Skriv hälsning</button>`:""}</div>
    <div class="stack">${hs.length ? hs.map(x=>handoverCard(x, true)).join("") : `<div class="card empty">Skriv några rader till ${esc(otherLabel())} inför bytet, t.ex. om sjukdom, läxor eller saker som glömts.</div>`}</div></div>`; })() : ""}
  <div class="section"><span class="eyebrow">${h.members}</span><div class="list">${parents.map(([id,p])=>`<${id===S.uid?"button":"div"} class="item" ${id===S.uid?'data-act="editMe"':""}><div class="cat-ic">${esc((p.label||"?").slice(0,1))}</div><div class="main"><div class="t">${esc(p.label)}${id===S.uid?" (du)":""}</div><div class="s">${id===S.uid?"Tryck för att byta namn":"Gemensam kalender och kvitton"}</div></div></${id===S.uid?"button":"div"}>`).join("")}</div></div>
  ${otherIds().length===0?`<div class="section card stack"><h3>Bjud in ${h.partner}</h3><p class="muted small" style="margin:0">Du får en länk som du skickar med sms eller mejl. Den som öppnar länken och skapar ett konto kommer med här, och bara här. Länken gäller i 14 dagar och kan användas en gång.</p>${canAct()?`<button class="btn primary block" data-act="invite">Skapa inbjudningslänk</button>`:""}<p class="small muted" style="margin:0">Det som ligger under <b>Mitt</b> ser bara du, även efter att ni delat.</p></div>`:""}
`;
}

/* ----- private space ----- */
function renderMine(){
  if (!["budget","cal","lists","archive"].includes(S.tab.mine)) S.tab.mine = "budget";
  const tab = S.tab.mine; let body = "";
  if (tab === "budget") body = renderBudget();
  else if (tab === "cal") {
    const sh = H().shared && S.showSharedInMine;
    const evs = [...myEvents().map(e=>({...e,_s:"mine"})), ...(sh ? visibleEvents().map(e=>({...e,_s:"shared"})) : [])];
    body = `<div class="row" style="margin:6px 0 12px;flex-wrap:wrap">${H().shared?`<button class="chip" data-act="toggleShared" aria-pressed="${S.showSharedInMine}"><span class="dot" style="background:var(--shared)"></span>Visa ${H().space.toLowerCase()}s kalender</button>`:""}<span class="small muted">Dina egna händelser ser bara du.</span></div>${renderCalendar("mine", evs)}`;
  } else if (tab === "lists") body = renderLists();
  else if (tab === "archive") body = renderArchive();
  return topBar("Mitt", "Privat – bara du ser detta") + body;
}
function periodFilter(e, y, m){ const d = e.date; return m == null ? d.startsWith(String(y)) : d.slice(0,7) === `${y}-${pad(m+1)}`; }
function renderBudget(){
  const y = S.budgetYear, mo = S.budgetPeriod === "month" ? S.budgetMonth : null;
  const ex = budgetExp(), cur = ex.filter(e=>periodFilter(e,y,mo)), prev = ex.filter(e=>periodFilter(e,y-1,mo));
  const sum = a => a.reduce((s,e)=>s+Number(e.amount||0),0);
  const total = sum(cur), ptotal = sum(prev);
  const delta = ptotal ? (total-ptotal)/ptotal*100 : null;
  const budgets = settings().budgets || {};
  const cats = {}; for (const e of cur) cats[e.category||"Övrigt"] = (cats[e.category||"Övrigt"]||0) + Number(e.amount||0);
  for (const c of Object.keys(budgets)) if (mo!=null && !(c in cats)) cats[c] = 0;
  const rows = Object.entries(cats).sort((a,b)=>b[1]-a[1]);
  const bmult = mo == null ? 12 : 1;
  const maxV = Math.max(1, ...rows.map(([c,v]) => Math.max(v, (budgets[c]||0)*bmult)));
  // 12 month columns
  const ty = Array.from({length:12},(_,i)=>sum(ex.filter(e=>periodFilter(e,y,i)))), ly = Array.from({length:12},(_,i)=>sum(ex.filter(e=>periodFilter(e,y-1,i))));
  const cmax = Math.max(1,...ty,...ly);
  const selM = S.budgetMonth;
  const label = mo == null ? String(y) : `${MONTHS[mo]} ${y}`;
  return `<div class="row" style="margin:6px 0 12px;flex-wrap:wrap"><div class="seg"><button data-act="period" data-p="month" aria-pressed="${S.budgetPeriod==="month"}">Månad</button><button data-act="period" data-p="year" aria-pressed="${S.budgetPeriod==="year"}">År</button></div><div class="spacer"></div>
    <button class="iconbtn" data-act="bNav" data-n="-1" aria-label="Föregående">${IC.left}</button><b style="min-width:110px;text-align:center;text-transform:capitalize">${label}</b><button class="iconbtn" data-act="bNav" data-n="1" aria-label="Nästa">${IC.right}</button></div>
  <div class="card stack">
    <span class="eyebrow">Utgifter ${label}</span>
    <div class="stat"><span class="big">${fmtKr(total)}</span>${delta!=null?`<span class="delta" style="color:${delta>0?"var(--warn)":"var(--good)"}">${delta>0?"▲":"▼"} ${Math.abs(delta).toFixed(0)} % mot ${mo==null?y-1:MON_D[mo]+" "+(y-1)}</span>`:""}</div>
    <div><div class="cols" role="img" aria-label="Utgifter per månad ${y} jämfört med ${y-1}">${ty.map((v,i)=>`<button class="col" data-act="pickMonth" data-m="${i}" aria-pressed="${S.budgetPeriod==="month"&&i===selM}" title="${MONTHS[i]}: ${fmtKr(v)} (${y-1}: ${fmtKr(ly[i])})"><span class="ly" style="height:${ly[i]/cmax*100}%"></span><span class="ty" style="height:${v/cmax*100}%"></span></button>`).join("")}</div>
    <div class="col-labels">${MON_D.map(m=>`<span>${m}</span>`).join("")}</div>
    <div class="legend"><span><i style="background:var(--accent)"></i>${y}</span><span><i style="background:var(--line)"></i>${y-1}</span><span class="spacer"></span><span>Tryck på en stapel</span></div></div>
  </div>
  ${canAct()?`<div class="btnrow" style="margin-top:12px"><button class="btn" data-act="recurList">Fasta kostnader${S.my.some(d=>d.kind==="recur")?` · ${fmtKr(S.my.filter(d=>d.kind==="recur" && (!d.end || d.end >= ymd(new Date()).slice(0,7))).reduce((a,d)=>a+Number(d.amount||0),0))}/mån`:""}</button><button class="btn" data-act="tab" data-t="archive">${IC.archive} Kvitton</button></div>`:""}
  <div class="section"><div class="row" style="margin-bottom:8px"><span class="eyebrow">Per kategori</span><div class="spacer"></div>${canAct()?`<button class="btn" data-act="budgets">Sätt budget</button>`:""}</div>
    <div class="card bars">${rows.length ? rows.map(([c,v])=>{ const bud = (budgets[c]||0)*bmult, over = bud && v > bud;
      return `<div class="bar-row"><div class="lab"><span>${esc(c)}</span><b>${fmtKr(v)}${bud?` <span class="muted" style="font-weight:500">/ ${fmtKr(bud)}</span>`:""}</b></div><div class="track"><div class="fill${over?" over":""}" style="width:${v/maxV*100}%"></div>${bud?`<span class="budgetmark" style="left:calc(${Math.min(100,bud/maxV*100)}% - 1px)"></span>`:""}</div>${over?`<div class="small" style="color:var(--warn);font-weight:600;margin-top:4px">${fmtKr(v-bud)} över budget</div>`:""}</div>`; }).join("") : `<div class="empty">Inga utgifter ${label}.</div>`}</div></div>
  ${goalsSection()}
  ${renderProjects()}`;
}
function listItem(d){
  const k = kidByName(d.childName), sub = [];
  if (d.childName) sub.push(`<span class="tag"><span class="dot" style="background:${k?kidColor(k):"var(--ink-3)"}"></span>${esc(d.childName)}</span>`);
  if (d.due) { const late = !d.done && d.due < ymd(new Date()); sub.push(`<span style="${late?"color:var(--crit);font-weight:600":""}">${late?"Försenad · ":""}${dayLabel(d.due)}</span>`); }
  const co = d._coll || "my";
  return `<div class="item${d.done?" done":""}"><button class="check${d.done?" on":""}" data-act="toggleItem" data-coll="${co}" data-id="${esc(d.id)}" aria-label="${d.done?"Ångra":"Bocka av"} ${esc(d.text)}">${d.done?IC.check:""}</button>
    <div class="main"><div class="t">${esc(d.text)}</div>${sub.length?`<div class="s row" style="gap:6px;flex-wrap:wrap">${sub.join("")}</div>`:""}</div>
    <button class="xbtn" data-act="delItem" data-coll="${co}" data-id="${esc(d.id)}" aria-label="Ta bort ${esc(d.text)}">${IC.x}</button></div>`;
}
function shopBlock(){ return renderLists(true); }
function renderLists(onlyShop){
  const kids = myKids(), f = onlyShop ? null : S.listKid;
  const match = d => !f || d.childName === f;
  const shop = shopItems().filter(match), todo = myTodos().filter(match);
  const byTime = (a,b) => (a.createdAt||0)-(b.createdAt||0);
  const shopOpen = shop.filter(d=>!d.done).sort((a,b)=>((a.group==="mat")?0:1)-((b.group==="mat")?0:1) || byTime(a,b));
  const todoOpen = todo.filter(d=>!d.done).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999") || byTime(a,b));
  const done = arr => arr.filter(d=>d.done).sort((a,b)=>(b.updatedAt||b.createdAt||0)-(a.updatedAt||a.createdAt||0)).slice(0,15);
  const block = (kind, title, open, dn, ph) => `<div class="section"><div class="row" style="margin-bottom:8px"><span class="eyebrow">${title}</span><div class="spacer"></div>${kind==="shop"&&canAct()?`<button class="btn ai-btn" style="padding:6px 10px;font-size:13px" data-act="dinner">Middagstips</button>`:""}${dn.length?`<button class="btn" style="padding:6px 10px;font-size:13px;margin-left:6px" data-act="clearDone" data-kind="${kind}">Rensa avbockade</button>`:""}</div>
    <div class="list">${open.length ? open.map(listItem).join("") : `<div class="empty">${kind==="shop"?"Inget att handla.":"Inget att göra."}</div>`}${dn.map(listItem).join("")}
    ${canAct()?`<form class="addrow" data-form="add" data-kind="${kind}"><input id="add-${kind}" data-keep name="text" maxlength="80" autocomplete="off" placeholder="${ph}" aria-label="${title}: ny rad">
      ${kind==="todo"?`<input id="add-due" name="due" type="date" style="flex:0 0 130px" aria-label="Senast">`:""}<button class="btn primary" type="submit" aria-label="Lägg till">${IC.plus}</button></form>`:""}</div></div>`;
  if (onlyShop) return block("shop","Inköpslista",shopOpen,done(shop),"Lägg till vara");
  return `<div class="row" style="margin:6px 0 4px;flex-wrap:wrap;gap:8px">${kids.length ? `<div class="chips"><button class="chip" data-act="listKid" data-n="" aria-pressed="${!f}">Alla</button>${kids.map(c=>`<button class="chip" data-act="listKid" data-n="${esc(c.name)}" aria-pressed="${f===c.name}"><span class="dot" style="background:${kidColor(c)}"></span>${esc(c.name)}</button>`).join("")}<button class="chip" data-act="myKids" style="border-style:dashed">Mina barn</button></div>`
      : `<button class="btn" data-act="myKids">${IC.kids} Lägg in dina barn</button>`}</div>
    <p class="small muted" style="margin:6px 0 0">Tips: skriv direkt på startsidan, t.ex. "köpa ny jacka till ${esc(kids[0]?.name||"Ella")}".${f?` Nya rader kopplas till ${esc(f)}.`:""}</p>
    ${block("shop", shopShared() ? `Inköpslista · delas med ${esc(otherLabel())}` : "Inköpslista",shopOpen,done(shop),"Lägg till vara")}
    ${block("todo","Att göra",todoOpen,done(todo),"Ny uppgift")}
    ${choresShared() ? "" : `<div id="chores">${choresBlock()}</div>`}`;
}
function archiveList(){
  const q = S.archQ.trim().toLowerCase();
  let all = [...myExp().map(e=>({...e,_s:"mine"})), ...S.expenses.map(e=>({...e,_s:"shared"}))];
  if (S.archScope !== "all") all = all.filter(e => e._s === S.archScope);
  if (q) all = all.filter(e => { const txt = [e.store, e.category, e.note, ...(e.items||[]).map(i=>i.name)].join(" ").toLowerCase();
    return q.includes(" ") ? txt.includes(q) : txt.split(/[^0-9a-zåäöéü]+/).some(w => w.startsWith(q)); });
  all.sort((a,b)=>b.date.localeCompare(a.date));
  return all.length ? `<div class="list">${all.slice(0,100).map(e=>expenseItem(e, e._s, true)).join("")}</div>${all.length>100?`<p class="small muted">Visar de 100 senaste. Sök för att hitta äldre.</p>`:""}`
    : `<div class="card empty">${q?`Inga kvitton matchar "${esc(S.archQ)}".`:"Inga kvitton sparade än."}</div>`;
}
function renderArchive(){
  return `${canAct()?`<div class="btnrow" style="margin:6px 0 12px"><button class="btn primary" data-act="scan" data-scope="mine">${IC.camera} Skanna kvitto</button><button class="btn" data-act="manual" data-scope="mine">Skriv in utan kvitto</button></div>`:""}
    <p class="small muted" style="margin:0 0 10px">Alla kvitton sparas med bild, så du slipper spara papperslappar. Sök t.ex. på "tv".</p>
    <input class="search" id="arch-q" data-keep type="search" placeholder="Sök butik eller vara" aria-label="Sök kvitton" autocomplete="off">
    <div class="row" style="margin:10px 0"><div class="seg"><button data-act="archScope" data-s="all" aria-pressed="${S.archScope==="all"}">Alla</button><button data-act="archScope" data-s="mine" aria-pressed="${S.archScope==="mine"}">Mina</button>${H().shared?`<button data-act="archScope" data-s="shared" aria-pressed="${S.archScope==="shared"}">Gemensamma</button>`:""}</div></div>
    <div id="arch-results">${archiveList()}</div>`;
}
function renderProjects(){
  const ps = myProjects().sort((a,b)=>(a.status==="done")-(b.status==="done") || (b.start||"").localeCompare(a.start||""));
  return `<div class="section"><div class="row" style="margin-bottom:8px"><span class="eyebrow" style="flex:1">Projekt</span>${canAct()?`<button class="btn" style="padding:6px 10px;font-size:13px" data-act="editProj">${IC.plus} Nytt projekt</button>`:""}</div>
  <div class="stack">${ps.length ? ps.map(p=>{ const ex = myExp().filter(e=>e.project===p.id), spent = ex.reduce((s,e)=>s+Number(e.amount||0),0), pct = p.budget ? spent/p.budget*100 : 0;
    return `<button class="card" style="text-align:left;width:100%" data-act="openProj" data-id="${esc(p.id)}"><div class="row"><h3 style="flex:1;font-weight:700">${esc(p.name)}</h3>${p.status==="done"?`<span class="tag">Klart</span>`:""}</div>
      <div class="stat" style="margin-top:6px"><span class="big" style="font-size:22px">${fmtKr(spent)}</span>${p.budget?`<span class="muted">av ${fmtKr(p.budget)}</span>`:""}</div>
      ${p.budget?`<div class="prog"><div class="${pct>100?"over":""}" style="width:${Math.min(100,pct)}%"></div></div><div class="small muted" style="margin-top:6px">${pct>100?`<b style="color:var(--warn)">${fmtKr(spent-p.budget)} över budget</b>`:`${fmtKr(p.budget-spent)} kvar · ${pct.toFixed(0)} % använt`} · ${ex.length} kvitton</div>`:`<div class="small muted">${ex.length} kvitton</div>`}</button>`; }).join("")
    : `<div class="card empty">Samla kostnaderna för t.ex. en renovering eller ett nytt kök och följ dem mot en budget.</div>`}</div></div>`;
}

/* ----- chrome: tabs ----- */
function renderChrome(){
  const bar = $("#tabbar");
  if (S.view === "home") { bar.hidden = true; return; }
  bar.hidden = false; bar.style.setProperty("--accent", S.view==="mine"?"var(--mine)":S.space==="hem"?"var(--hem)":"var(--shared)");
  const tabs = S.view === "shared" ? [["cal","Kalender",IC.cal],["money","Kvitton",IC.money], ...(shopShared()?[["shop","Inköp",IC.list],["chores","Sysslor",IC.swish]]:[]), ...(H().stays?[["lov","Lov",IC.cal]]:[]), ["kids",H().tabKids,IC.kids]] : [["budget","Budget",IC.chart],["cal","Kalender",IC.cal],["lists","Listor",IC.list],["archive","Kvitton",IC.archive]];
  $("#tabs").innerHTML = tabs.map(([k,l,i])=>`<button data-act="tab" data-t="${k}" aria-current="${S.tab[S.view]===k}">${i}<span>${l}</span></button>`).join("");
  const t = S.tab[S.view];
}

/* ---------- sheets ---------- */
function openSheet(html, scope){
  $("#sheetRoot").innerHTML = `<div class="scrim" data-act="closeScrim"><div class="sheet ${scope==="mine"?"mine":S.space==="hem"?"hem":""}" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
  const first = $("#sheetRoot input:not([type=file]):not([type=checkbox]), #sheetRoot select"); if (first && !("ontouchstart" in window)) first.focus();
}
function closeSheet(){ $("#sheetRoot").innerHTML = ""; }
function toast(msg){ const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(()=>t.hidden=true, 2600); }
const sheetHead = (title, sub) => `<div class="row" style="margin-bottom:14px"><div style="flex:1"><h2>${title}</h2>${sub?`<div class="small muted">${sub}</div>`:""}</div><button class="iconbtn" data-act="close" aria-label="Stäng"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>`;

function eventSheet(scope, id){
  const list = scope === "shared" ? S.events : myEvents();
  const e = id ? list.find(x=>x.id===id) : null;
  const v = e || {date:S.selDay[scope], start:"", end:"", kind:"aktivitet", childIds:S.children.length===1?[S.children[0].id]:[], with:""};
  const parentOpts = Object.entries(S.parents).map(([pid,p])=>`<option value="${esc(pid)}" ${v.with===pid?"selected":""}>${esc(pid===S.uid?p.label+" (du)":p.label)}</option>`).join("");
  openSheet(`${sheetHead(e?"Ändra händelse":"Ny händelse", scope==="shared"?`Syns för dig och ${esc(otherLabel())}`:"Privat – syns bara för dig")}
  <form id="evForm" class="stack">
    ${e?.friend?.name ? `<div class="card row" style="gap:12px"><div class="cat-ic" style="background:var(--shared-soft);color:var(--shared)">${esc(e.friend.name.slice(0,1).toUpperCase())}</div><div style="flex:1;min-width:0"><b>${esc(e.friend.name)}</b><div class="small muted">${e.friend.parent?esc(e.friend.parent)+" · ":""}${e.friend.phone?`<span class="phone">${esc(e.friend.phone)}</span>`:"inget nummer"}</div>${e.friend.note?`<div class="small muted">${esc(e.friend.note)}</div>`:""}</div>${e.friend.phone?`<button type="button" class="btn" style="padding:6px 10px;font-size:13px" data-act="copyTxt" data-t="${esc(e.friend.phone)}">Kopiera nr</button>`:""}</div>` : ""}
    <label class="field"><span>Vad händer?</span><input id="ev-title" name="title" required maxlength="80" value="${esc(v.title||"")}" placeholder="${scope==="shared"?"Ex. Leker hos Saga":"Ex. Padel"}"></label>
    ${scope==="shared"?`<label class="field"><span>Typ</span><select id="ev-kind" name="kind">${Object.entries(KINDS).filter(([k])=>H().stays||k!=="boende").map(([k,l])=>`<option value="${k}" ${v.kind===k?"selected":""}>${l}</option>`).join("")}</select></label>`:""}
    <div class="two"><label class="field"><span>Datum</span><input id="ev-date" type="date" name="date" required value="${esc(v.date)}"></label>
      ${scope==="shared"?`<label class="field"><span>Ansvarig / hos</span><select id="ev-with" name="with"><option value="">Ingen särskild</option>${parentOpts}</select></label>`:"<span></span>"}</div>
    <div class="two"><label class="field"><span>Från (tom = heldag)</span><input id="ev-start" type="time" name="start" value="${esc(v.start||"")}"></label><label class="field"><span>Till</span><input id="ev-end" type="time" name="end" value="${esc(v.end||"")}"></label></div>
    ${scope==="shared"&&H().kids&&S.children.length?`<div class="field"><span>Vilka barn?</span><div class="chips">${S.children.map(c=>`<label class="chip"><input type="checkbox" name="kids" value="${esc(c.id)}" ${(v.childIds||[]).includes(c.id)?"checked":""}><span class="dot" style="background:${kidColor(c)}"></span>${esc(c.name)}</label>`).join("")}</div></div>`:""}
    ${scope==="shared"&&H().kids ? (() => { const fr = S.children.flatMap(c => (c.friends||[]).map((f,i) => ({c, f, key:c.id+"|"+i})));
      const selKey = v.friend ? (fr.find(x => x.f.name === v.friend.name && (x.f.phone||"") === (v.friend.phone||""))?.key || "") : "";
      return `<label class="field" id="ev-friendwrap" ${v.kind==="lek"?"":"hidden"}><span>Vilken kompis?</span>${fr.length ? `<select id="ev-friend" name="friend"><option value="">Välj kompis…</option>${S.children.filter(c=>c.friends?.length).map(c=>`<optgroup label="${esc(c.name)}s kompisar">${c.friends.map((f,i)=>`<option value="${esc(c.id+"|"+i)}" ${selKey===c.id+"|"+i?"selected":""}>${esc(f.name)}${f.phone?" – "+esc(f.phone):""}</option>`).join("")}</optgroup>`).join("")}</select><span class="small muted" style="font-weight:400">Förälderns nummer visas på händelsen.</span>` : `<span class="small muted" style="font-weight:400">Lägg till kompisar på barnkortet så kan du välja dem här.</span>`}</label>`; })() : ""}
    <label class="field"><span>Anteckning</span><textarea id="ev-note" name="note" rows="2" placeholder="${scope==="shared"?"Ex. vem som hämtar, packa gympapåse":""}">${esc(v.note||"")}</textarea></label>
    ${!e?`<label class="row small"><input id="ev-rep" type="checkbox" name="repeat"> Upprepa varje vecka i <input id="ev-reps" name="reps" type="number" min="2" max="40" value="10" style="width:64px;border:1px solid var(--line);border-radius:8px;padding:4px 6px;background:var(--surface)"> veckor</label>`:""}
    <button class="btn primary block" type="submit">${e?"Spara ändringar":"Lägg till"}</button>
    ${e?`<button class="btn danger block" type="button" data-act="del" data-coll="${scope==="shared"?"events":"my"}" data-id="${esc(e.id)}">Ta bort händelsen</button>`:""}
  </form>`, scope);
  const evf = $("#evForm");
  evf.addEventListener("change", ev2 => {
    if (ev2.target.id === "ev-kind") { const w = $("#ev-friendwrap"); if (w) w.hidden = ev2.target.value !== "lek"; }
    if (ev2.target.id === "ev-friend" && ev2.target.value) {
      const [cid, i] = ev2.target.value.split("|"), c = kid(cid), fr = c?.friends?.[Number(i)]; if (!fr) return;
      const t = $("#ev-title"); if (!t.value.trim() || /^Leker (hos|med) /.test(t.value)) t.value = `Leker hos ${fr.name}`;
      const cb = evf.querySelector(`input[name="kids"][value="${CSS.escape(cid)}"]`); if (cb) cb.checked = true;
    }
  });
  evf.onsubmit = async ev => {
    ev.preventDefault();
    const f = new FormData(ev.target);
    const doc = {title:f.get("title").trim(), date:f.get("date"), start:f.get("start")||"", end:f.get("end")||"", note:(f.get("note")||"").trim()};
    if (scope === "shared") Object.assign(doc, {kind:f.get("kind"), with:f.get("with")||"", childIds:f.getAll("kids")});
    if (scope === "shared") {
      const fk = doc.kind === "lek" ? f.get("friend") : "";
      if (fk) { const [cid, i] = fk.split("|"); const fr = kid(cid)?.friends?.[Number(i)]; doc.friend = fr ? {name:fr.name, parent:fr.parent||"", phone:fr.phone||"", note:fr.note||""} : null; }
      else doc.friend = doc.kind === "lek" && e?.friend && f.get("friend") === null ? e.friend : null;
    }
    else doc.kind = "event";
    const reps = f.get("repeat") ? Math.min(40, Math.max(2, Number(f.get("reps"))||2)) : 1;
    const docs = Array.from({length:reps}, (_,i) => ({...doc, date: ymd(addDays(parseD(doc.date), 7*i))}));
    closeSheet();
    await saveDocs(scope === "shared" ? "events" : "my", docs, e?.id);
    if (scope === "shared" && !e) notifyOther(`${me().label} lade till "${doc.title}" ${dayLow(doc.date)}${reps>1?` (varje vecka, ${reps} gånger)`:""}.`);
    toast(e ? "Ändringen är sparad" : reps>1 ? `${reps} händelser tillagda` : "Händelsen är tillagd");
  };
}

/* ----- receipt flow ----- */
let pending = null; // {blob, url, items}
async function prepImage(file){
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth*scale); c.height = Math.round(img.naturalHeight*scale);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    const blob = await new Promise(r => c.toBlob(r, "image/jpeg", 0.85));
    URL.revokeObjectURL(url);
    return {blob, url: URL.createObjectURL(blob)};
  } catch(e) { return {blob:file, url}; }
}
async function smallDataUrl(blob){
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    for (const [w,q] of [[1300,.72],[1100,.62],[950,.55],[800,.5],[650,.45],[520,.4]]) {
      const sc = Math.min(1, w / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth*sc); c.height = Math.round(img.naturalHeight*sc);
      const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0,0,c.width,c.height); ctx.drawImage(img, 0, 0, c.width, c.height);
      const d = c.toDataURL("image/jpeg", q);
      if (d.length < 220000) return d;
    }
    throw new Error("too big");
  } finally { URL.revokeObjectURL(url); }
}
function imgRef(scope, id){ return scope === "shared" ? sharedDB().collection("receiptImgs").doc(id) : S.db.doc("data/users/" + S.uid + "/receipts").collection("img").doc(id); }
async function saveImg(scope, dataUrl){
  const id = "r" + Date.now().toString(36) + uidGen();
  S.imgCache[id] = dataUrl;
  if (S.mode !== "demo" && (S.space !== "hem" || S.dbHem)) await imgRef(scope, id).set({data:dataUrl, createdAt:Date.now(), createdBy:S.uid});
  return id;
}
async function loadImg(scope, id){
  if (S.imgCache[id]) return S.imgCache[id];
  if (S.mode === "demo") return null;
  const snap = await imgRef(scope, id).get();
  const d = snap.exists ? snap.data().data : null;
  if (d) S.imgCache[id] = d;
  return d;
}
function expenseSheet(scope, opts){
  const existing = opts?.id ? (scope==="shared" ? S.expenses : myExp()).find(x=>x.id===opts.id) : null;
  const v = existing || {date:ymd(new Date()), split:50, paidBy:S.uid, childIds:S.children.length===1?[S.children[0].id]:[], category:"", project:""};
  pending = existing ? {items: existing.items||[]} : {items: []};
  const cats = scope==="shared" ? H().cats : MY_CATS;
  const scanning = opts?.scan && !existing;
  const projOpts = myProjects().filter(p=>p.status!=="done"||p.id===v.project).map(p=>`<option value="${esc(p.id)}" ${v.project===p.id?"selected":""}>${esc(p.name)}</option>`).join("");
  const splitPreset = [50,100,0].includes(v.split) ? String(v.split) : "custom";
  openSheet(`${sheetHead(existing?"Ändra kvitto":scanning?"Skanna kvitto":"Ny utgift", scope==="shared"?`Delas med ${esc(otherLabel())}`:"Privat budget")}
  <form id="exForm" class="stack">
    ${scanning?`<label class="drop" id="drop">${IC.camera}<span>Fota eller välj en bild på kvittot</span><span class="small muted" style="font-weight:500">AI läser butik, datum och belopp</span><input id="ex-file" type="file" accept="image/*" capture="environment"></label>
      <img id="ex-prev" class="preview" alt="Kvittot" hidden><div id="ex-ai" class="ai" hidden></div>`:""}
    ${existing?.receipt?`<img class="preview" src="${esc(existing.receipt)}" alt="Kvittot">`:""}
    <div id="ex-fields" class="stack" ${scanning?"hidden":""}>
      <div class="two"><label class="field"><span>Butik</span><input id="ex-store" name="store" required maxlength="60" value="${esc(v.store||"")}" placeholder="Ex. H&M"></label>
        <label class="field"><span>Datum</span><input id="ex-date" type="date" name="date" required value="${esc(v.date)}"></label></div>
      <div id="ex-lines"></div>
      <label class="field"><span>Belopp (kr)</span><input id="ex-amount" name="amount" inputmode="decimal" required value="${v.amount??""}" placeholder="0"></label>
      <label class="field"><span>Kategori</span><select id="ex-cat" name="category" required><option value="">Välj…</option>${cats.map(c=>`<option value="${esc(c)}" ${v.category===c?"selected":""}>${c}</option>`).join("")}</select></label>
      ${scope==="shared"?`
        ${H().kids&&S.children.length?`<div class="field"><span>Vilket barn gäller det?</span><div class="chips">${S.children.map(c=>`<label class="chip"><input type="checkbox" name="kids" value="${esc(c.id)}" ${(v.childIds||[]).includes(c.id)?"checked":""}><span class="dot" style="background:${kidColor(c)}"></span>${esc(c.name)}</label>`).join("")}</div></div>`:""}
        <div class="two"><label class="field"><span>Vem betalade?</span><select id="ex-paid" name="paidBy">${Object.entries(S.parents).map(([pid,p])=>`<option value="${esc(pid)}" ${v.paidBy===pid?"selected":""}>${esc(pid===S.uid?"Jag":p.label)}</option>`).join("")}</select></label>
        <label class="field"><span>Fördelning</span><select id="ex-split" name="splitPreset"><option value="50" ${splitPreset==="50"?"selected":""}>Hälften var</option><option value="100" ${splitPreset==="100"?"selected":""}>Den andra betalar allt</option><option value="0" ${splitPreset==="0"?"selected":""}>Delas inte</option><option value="custom" ${splitPreset==="custom"?"selected":""}>Egen procent</option></select></label></div>
        <label class="field" id="ex-customwrap" ${splitPreset==="custom"?"":"hidden"}><span>${esc(otherLabel())}s andel (%)</span><input id="ex-custom" name="custom" type="number" min="0" max="100" value="${splitPreset==="custom"?v.split:60}"></label>
        <div id="ex-owe" class="owe"></div>`
      : `<label class="field"><span>Projekt (valfritt)</span><select id="ex-proj" name="project"><option value="">Inget projekt</option>${projOpts}</select></label>`}
      <label class="field"><span>Garanti / reklamationsrätt</span><select id="ex-war" name="warranty">${[["auto","Automatiskt (3 år för saker, inget för mat och tjänster)"],["0","Ingen"],["1","1 år"],["2","2 år"],["3","3 år – reklamationsrätt"],["5","5 år"],["10","10 år"]].map(([k,l])=>`<option value="${k}" ${String(existing?.warrantyYears ?? "auto")===k?"selected":""}>${l}</option>`).join("")}</select></label>
      <label class="field"><span>Anteckning</span><input id="ex-note" name="note" maxlength="120" value="${esc(v.note||"")}"></label>
      <button class="btn primary block" type="submit" id="ex-save">${existing?"Spara ändringar":scope==="shared"?"Spara och skicka notis":"Spara"}</button>
      ${existing?`<button class="btn danger block" type="button" data-act="del" data-coll="${scope==="shared"?"expenses":"my"}" data-id="${esc(existing.id)}">Ta bort kvittot</button>`:""}
    </div>
  </form>`, scope);
  const form = $("#exForm");
  const updOwe = () => {
    const el = $("#ex-owe"); if (!el) return;
    const amt = parseAmount(form.amount.value), pct = splitValue(form), payer = form.paidBy.value, share = amt*pct/100;
    const debtor = payer === S.uid ? otherLabel() : "Du";
    $("#ex-customwrap").hidden = form.splitPreset.value !== "custom";
    el.textContent = !amt ? "Fyll i beloppet så räknas fördelningen ut." : pct === 0 ? "Utgiften loggas men ingen blir skyldig något." :
      `${debtor} ${debtor==="Du"?"blir skyldig":"blir skyldig dig"} ${fmtKr(share)}${debtor==="Du"?" till "+otherLabel():""}.`;
  };
  form.addEventListener("input", updOwe); updOwe();
  renderLines();
  const file = $("#ex-file");
  if (file) file.onchange = async () => { if (file.files[0]) await handleReceipt(file.files[0], scope); };
  form.onsubmit = async ev => {
    ev.preventDefault();
    const f = new FormData(form), amt = parseAmount(f.get("amount"));
    if (!amt) { toast("Fyll i ett belopp"); return; }
    const doc = {store:f.get("store").trim(), date:f.get("date"), amount:amt, category:f.get("category"), note:(f.get("note")||"").trim(), items:pending.items.filter(i=>i.on!==false).map(({name,price})=>({name,price}))};
    if (scope === "shared") Object.assign(doc, {childIds:f.getAll("kids"), paidBy:f.get("paidBy"), split:splitValue(form)});
    else Object.assign(doc, {kind:"exp", project:f.get("project")||""});
    const w = f.get("warranty"), yrs = w === "auto" ? (NO_WARRANTY.includes(doc.category) ? 0 : 3) : Number(w);
    doc.warrantyYears = yrs;
    doc.warrantyUntil = doc.warrantyYears ? ymd(new Date(parseD(doc.date).setFullYear(parseD(doc.date).getFullYear() + doc.warrantyYears))) : "";
    const btn = $("#ex-save"); btn.disabled = true; btn.textContent = "Sparar kvittot…";
    if (pending.blob) {
      try { doc.imgId = await saveImg(scope, await smallDataUrl(pending.blob)); }
      catch(e) { toast("Bilden kunde inte sparas, men uppgifterna sparas."); }
    }
    if (existing?.imgId && !doc.imgId) doc.imgId = existing.imgId;
    if (existing?.receipt && !doc.receipt) doc.receipt = existing.receipt;
    closeSheet();
    await saveDocs(scope === "shared" ? "expenses" : "my", [doc], existing?.id);
    if (scope === "shared" && !existing && doc.split > 0) {
      const kids = doc.childIds.map(kid).filter(Boolean).map(c=>c.name).join(" och ");
      const share = fmtKr(doc.amount*doc.split/100);
      const txt = doc.paidBy === S.uid
        ? `${me().label} har köpt ${doc.category.toLowerCase()} på ${doc.store} för ${fmtKr(doc.amount)}${kids?" till "+kids:""}. Du är skyldig ${me().label} ${share}.`
        : `${me().label} lade in ${doc.store} ${fmtKr(doc.amount)} som du betalade${kids?" för "+kids:""}. ${me().label} är skyldig dig ${share}.`;
      notifyOther(txt);
    }
    toast(existing ? "Ändringen är sparad" : scope==="shared" ? (otherId() ? `Sparat. ${otherLabel()} har fått en notis.` : "Sparat") : "Kvittot är sparat");
  };
}
function parseAmount(s){ return Math.round((parseFloat(String(s||"").replace(/\s/g,"").replace(",","."))||0)*100)/100; }
function splitValue(form){ const p = form.splitPreset?.value; return p === "custom" ? Math.min(100,Math.max(0,Number(form.custom.value)||0)) : Number(p ?? 50); }
function renderLines(){
  const box = $("#ex-lines"); if (!box) return;
  if (!pending.items.length) { box.innerHTML = ""; return; }
  box.innerHTML = `<div class="field"><span>Rader på kvittot – bocka ur det som inte ska räknas med</span><div class="lines">${pending.items.map((it,i)=>`<label><input type="checkbox" data-line="${i}" ${it.on!==false?"checked":""}><span>${esc(it.name)}</span><b class="num">${fmtKr(it.price)}</b></label>`).join("")}</div></div>`;
  box.querySelectorAll("[data-line]").forEach(cb => cb.onchange = () => {
    pending.items[cb.dataset.line].on = cb.checked;
    const sum = pending.items.filter(i=>i.on!==false).reduce((s,i)=>s+Number(i.price||0),0);
    const f = $("#exForm"); f.amount.value = Math.round(sum*100)/100; f.dispatchEvent(new Event("input"));
  });
}
async function handleReceipt(file, scope){
  const prev = $("#ex-prev"), ai = $("#ex-ai"), fields = $("#ex-fields");
  const img = await prepImage(file);
  pending.blob = img.blob;
  prev.src = img.url; prev.hidden = false; $("#drop").hidden = true;
  if (!S.sample || !S.canImages) {
    ai.hidden = false; ai.innerHTML = `<span>AI-läsning är inte tillgänglig här. Fyll i uppgifterna själv.</span>`;
    fields.hidden = false; return;
  }
  ai.hidden = false; ai.innerHTML = `<span class="spin"></span><span>Läser kvittot… det tar oftast 10–40 sekunder.</span>`;
  const cats = scope==="shared" ? H().cats : MY_CATS;
  const prompt = `Bilden är ett kvitto, troligen från en svensk butik. Läs av det och svara med ENDAST ett JSON-objekt i detta format:
{"store": "butikens namn, kort (t.ex. H&M, ICA Maxi, Bauhaus)", "date": "YYYY-MM-DD eller null", "total": totalbelopp i kronor som tal, "items": [{"name": "radens text, kort och läsbar på ${aiLang()}", "price": radens belopp i kronor som tal}], "category": en av ${JSON.stringify(cats)}}
Regler: total är det slutliga beloppet som betalades (inklusive moms, efter rabatter). Ta med rabatter som rader med negativt pris. Hoppa över moms-specifikation, betalkortsinfo och växel. Om bilden inte är ett kvitto, svara {"error": "kort förklaring på ${aiLang()}"}.`;
  try {
    const r = await S.sample.json(prompt, {images:[img.blob]});
    if (!r || r.error) throw {code:"not_receipt", message:r?.error};
    const f = $("#exForm"); if (!f) return;
    f.store.value = r.store || "";
    if (r.date && /^\d{4}-\d{2}-\d{2}$/.test(r.date)) f.date.value = r.date;
    f.amount.value = Number(r.total) || "";
    if (cats.includes(r.category)) f.category.value = r.category;
    pending.items = Array.isArray(r.items) ? r.items.filter(i=>i && i.name).slice(0,60).map(i=>({name:String(i.name).slice(0,80), price:Number(i.price)||0})) : [];
    renderLines();
    ai.innerHTML = `<span>✓</span><span><b>${esc(r.store||"Kvitto")} ${fmtKr(r.total)}</b> – kontrollera uppgifterna${scope==="shared"?" och välj barn":""}.</span>`;
    f.dispatchEvent(new Event("input"));
  } catch(e) {
    const msg = {not_receipt: e.message || "Det ser inte ut som ett kvitto.", rate_limited:"För många förfrågningar just nu. Vänta en stund eller fyll i själv.", not_granted:"AI-läsning nekades. Fyll i uppgifterna själv.", image_rejected:"Bilden gick inte att läsa. Prova en annan bild.", invalid_json:"AI:n kunde inte tyda kvittot. Fyll i själv.", cancelled:"Avbrutet."}[e?.code] || "Kunde inte läsa kvittot. Fyll i uppgifterna själv.";
    ai.innerHTML = `<span>!</span><span>${esc(msg)}</span>`;
  }
  fields.hidden = false;
}

function expenseDetail(scope, id){
  const e = (scope==="shared" ? S.expenses : myExp()).find(x=>x.id===id); if (!e) return;
  const kids = (e.childIds||[]).map(kid).filter(Boolean);
  const share = Number(e.amount)*(e.split??50)/100;
  const proj = e.project ? myProjects().find(p=>p.id===e.project) : null;
  openSheet(`${sheetHead(esc(e.store), dayLabel(e.date))}
   <div class="stack">
    <div class="stat"><span class="big">${fmtKr(e.amount)}</span><span class="tag">${esc(e.category||"")}</span>${proj?`<span class="tag">${esc(proj.name)}</span>`:""}</div>
    ${scope==="shared"?`<div class="owe">${e.split===0?"Delas inte.":`${esc(parentLabel(e.paidBy))} betalade. ${e.paidBy===S.uid?esc(otherLabel())+" ska betala dig":"Din del är"} ${fmtKr(share)} (${e.split} %).`}</div>
      ${kids.length?`<div class="chips">${kids.map(c=>`<span class="tag"><span class="dot" style="background:${kidColor(c)}"></span>${esc(c.name)}</span>`).join("")}</div>`:""}`:""}
    ${e.items?.length?`<div class="lines">${e.items.map(i=>`<label><span>${esc(i.name)}</span><b class="num">${fmtKr(i.price)}</b></label>`).join("")}</div>`:""}
    ${e.note?`<p class="muted" style="margin:0">${esc(e.note)}</p>`:""}
    ${e.warrantyUntil?`<div class="card small">${e.warrantyUntil >= ymd(new Date()) ? `<b>Reklamation/garanti t.o.m. ${esc(e.warrantyUntil)}</b><br><span class="muted">Visa kvittot nedan i butiken om något går sönder.</span>` : `Reklamationstiden gick ut ${esc(e.warrantyUntil)}.`}</div>`:""}
    ${e.receipt?`<img class="receipt-big" src="${esc(e.receipt)}" alt="Kvittot">`:""}
    ${e.imgId?`<div id="rcpt-slot" class="ai"><span class="spin"></span><span>Hämtar kvittobilden…</span></div>`:`${e.receipt?"":`<p class="small muted" style="margin:0">Ingen bild sparad för det här kvittot.</p>`}`}
    ${canAct()?`<button class="btn block" data-act="editExp" data-scope="${scope}" data-id="${esc(e.id)}">Ändra</button>`:""}
   </div>`, scope);
  if (e.imgId) showReceipt(scope, e);
}

async function showReceipt(scope, e){
  const slot = $("#rcpt-slot"); if (!slot) return;
  try {
    const d = await loadImg(scope, e.imgId);
    if (!$("#rcpt-slot")) return;
    if (!d) { slot.innerHTML = `<span>Kvittobilden finns inte längre.</span>`; return; }
    slot.outerHTML = `<img class="receipt-big" src="${d}" alt="Kvittot från ${esc(e.store)}">${S.downloads?`<button class="btn block" data-act="dlReceipt" data-scope="${scope}" data-id="${esc(e.id)}">Spara bilden på telefonen</button>`:""}`;
  } catch(err) { slot.innerHTML = `<span>Kunde inte hämta bilden just nu. Försök igen om en stund.</span>`; }
}
async function downloadReceipt(scope, id){
  const e = (scope==="shared" ? S.expenses : myExp()).find(x=>x.id===id); if (!e || !S.downloads) return;
  const d = await loadImg(scope, e.imgId); if (!d) return;
  const blob = await (await fetch(d)).blob();
  try { await S.downloads.save({filename:`kvitto-${(e.store||"butik").replace(/[^\wåäöÅÄÖ-]+/g,"-")}-${e.date}.jpg`, data:blob}); } catch(err) {}
}
function paySheet(){
  const b = balance(), o = otherLabel(), iPay = b < 0;
  openSheet(`${sheetHead("Registrera betalning", iPay?`Du betalar ${esc(o)}`:`${esc(o)} betalar dig`)}
  <form id="payForm" class="stack">
    <label class="field"><span>Belopp (kr)</span><input id="pay-amt" name="amount" inputmode="decimal" value="${Math.abs(b)}"></label>
    <label class="field"><span>Datum</span><input id="pay-date" type="date" name="date" value="${ymd(new Date())}"></label>
    <p class="small muted" style="margin:0">Själva betalningen gör ni med Swish eller överföring. Här noterar ni bara att den är gjord, så att saldot stämmer.</p>
    <button class="btn primary block" type="submit">Markera som betalt</button></form>`, "shared");
  $("#payForm").onsubmit = async ev => {
    ev.preventDefault(); const f = new FormData(ev.target), amt = parseAmount(f.get("amount")); if (!amt) return;
    const from = iPay ? S.uid : otherId(), to = iPay ? otherId() : S.uid;
    closeSheet();
    await saveDocs("payments", [{from, to, amount:amt, date:f.get("date")}]);
    notifyOther(iPay ? `${me().label} har betalat dig ${fmtKr(amt)}.` : `${me().label} har noterat att du betalat ${fmtKr(amt)}. Tack!`);
    toast("Betalningen är noterad");
  };
}
function kidSheet(id){
  const c = id ? kid(id) : null;
  const used = S.children.map(x=>x.color);
  const color = c ? c.color : KID_COLORS.map((_,i)=>i).find(i=>!used.includes(i)) ?? S.children.length%KID_COLORS.length;
  openSheet(`${sheetHead(c?"Ändra barn":"Lägg till barn")}<form id="kidForm" class="stack">
    <label class="field"><span>Namn</span><input id="kid-name" name="name" required maxlength="30" value="${esc(c?.name||"")}"></label>
    <label class="field"><span>Födelsedag (valfritt)</span><input id="kid-birth" type="date" name="birth" value="${esc(c?.birth||"")}"></label>
    <span class="eyebrow" style="margin-top:6px">Barnkort – syns för er båda</span>
    ${KID_INFO.map(([k,l,ph])=>`<label class="field"><span>${l}</span>${["contacts","notes","school","health"].includes(k)?`<textarea id="kid-${k}" name="${k}" rows="2" placeholder="${ph}">${esc(c?.info?.[k]||"")}</textarea>`:`<input id="kid-${k}" name="${k}" maxlength="60" placeholder="${ph}" value="${esc(c?.info?.[k]||"")}">`}</label>`).join("")}
    <div class="field"><span>Färg i kalendern</span><div class="chips">${KID_COLORS.map((k,i)=>`<label class="chip"><input type="radio" name="color" value="${i}" ${i===color?"checked":""}><span class="dot" style="background:${k};width:16px;height:16px"></span></label>`).join("")}</div></div>
    <button class="btn primary block" type="submit">Spara</button>
    ${c?`<button class="btn danger block" type="button" data-act="del" data-coll="children" data-id="${esc(c.id)}">Ta bort ${esc(c.name)}</button>`:""}</form>`, "shared");
  $("#kidForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target);
    const info = Object.fromEntries(KID_INFO.map(([k]) => [k, (f.get(k)||"").trim()]));
    closeSheet(); await saveDocs("children", [{name:f.get("name").trim(), birth:f.get("birth")||"", color:Number(f.get("color")), info, updatedBy:S.uid}], c?.id);
    if (c && JSON.stringify(info) !== JSON.stringify(c.info||{})) notifyOther(`${me().label} uppdaterade ${c.name}s barnkort.`);
    toast("Sparat"); };
}
function kidCard(id, prefill){
  const c = kid(id); if (!c) return;
  const info = c.info || {};
  openSheet(`${sheetHead(`<span class="row" style="gap:8px"><span class="dot" style="background:${kidColor(c)};width:14px;height:14px"></span>${esc(c.name)}</span>`, c.birth ? `${age(c.birth)} år · född ${esc(c.birth)}` : "")}
    <dl class="info card" style="margin:0">${KID_INFO.map(([k,l])=>`<dt>${l}</dt><dd class="${info[k]?"":"empty-v"}">${info[k]?esc(info[k]):"Inte ifyllt"}</dd>`).join("")}</dl>
    <div class="section" style="margin-top:16px"><span class="eyebrow">Kompisar</span>
    <div class="list" style="margin-top:8px">${(c.friends||[]).length ? c.friends.map((f,i)=>`<div class="item"><div class="cat-ic" style="background:var(--shared-soft);color:var(--shared)">${esc((f.name||"?").slice(0,1).toUpperCase())}</div>
      <div class="main"><div class="t">${esc(f.name)}</div><div class="s">${f.parent?esc(f.parent)+" · ":""}${f.phone?`<span class="phone">${esc(f.phone)}</span>`:"inget nummer"}</div>${f.note?`<div class="s">${esc(f.note)}</div>`:""}</div>
      ${f.phone?`<button class="xbtn" data-act="copyTxt" data-t="${esc(f.phone)}" aria-label="Kopiera numret till ${esc(f.name)}s förälder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg></button>`:""}
      ${canAct()?`<button class="xbtn" data-act="delFriend" data-kid="${esc(c.id)}" data-i="${i}" aria-label="Ta bort ${esc(f.name)}">${IC.x}</button>`:""}</div>`).join("") : `<div class="empty">Inga kompisar tillagda än.</div>`}
    ${canAct()?`<details class="addfriend" style="border-top:1px solid var(--line)" ${(c.friends||[]).length && !prefill?"":"open"}><summary>+ Lägg till kompis</summary>
      <form class="stack" data-form="friend" data-kid="${esc(c.id)}" style="padding:0 14px 14px">
        <div class="two"><label class="field"><span>Kompisens namn</span><input id="fr-name" name="name" required maxlength="30" value="${esc(prefill||"")}"></label>
        <label class="field"><span>Förälder</span><input id="fr-parent" name="parent" maxlength="40" placeholder="Ex. Johan (pappa)"></label></div>
        <label class="field"><span>Telefon</span><input id="fr-phone" name="phone" type="tel" maxlength="20" placeholder="070-123 45 67"></label>
        <label class="field"><span>Bra att veta (valfritt)</span><input id="fr-note" name="note" maxlength="80" placeholder="Ex. adress, allergier"></label>
        <button class="btn primary block" type="submit">Spara kompis</button></form></details>`:""}</div></div>
    ${c.updatedAt?`<p class="small muted">Senast ändrat av ${c.updatedBy===S.uid?"dig":esc(parentLabel(c.updatedBy))} ${new Date(c.updatedAt).toLocaleDateString(LOC,{day:"numeric",month:"long"})}.</p>`:""}
    ${canAct()?`<button class="btn primary block" data-act="editKid" data-id="${esc(c.id)}">Ändra barnkortet</button>`:""}`, "shared");
}
function scheduleSheet(){
  const sc = S.schedule || {}, ids = Object.keys(S.parents);
  const mon = addDays(new Date(), -((new Date().getDay()+6)%7));
  openSheet(`${sheetHead("Boendeschema", "Fyller i var barnen bor framåt. Enstaka dagar ändrar ni med Be om byte.")}
  <form id="schedForm" class="stack">
    <label class="field"><span>Hur bor barnen?</span><select id="sc-pattern" name="pattern">${["vv","2255","223","helg"].map(k=>`<option value="${k}" ${(sc.pattern||"vv")===k?"selected":""}>${PATTERNS[k].label}</option>`).join("")}</select></label>
    <div class="two"><label class="field"><span>Första dagen i schemat</span><input id="sc-start" type="date" name="start" required value="${esc(sc.start||ymd(mon))}"></label>
    <label class="field"><span>Barnen börjar hos</span><select id="sc-first" name="first">${(ids.length?ids:[S.uid]).map(id=>`<option value="${esc(id)}" ${sc.first===id?"selected":""}>${id===S.uid?"Mig":esc(parentLabel(id))}</option>`).join("")}${ids.length<2?`<option value="other" ${sc.first==="other"?"selected":""}>${esc(otherLabel())}</option>`:""}</select></label></div>
    <div><span class="small muted">De första två veckorna:</span><div class="strip" id="sc-strip"></div></div>
    <button class="btn primary block" type="submit">Spara schemat</button>
    ${sc.pattern?`<button class="btn danger block" type="button" data-act="schedDel">Ta bort schemat</button>`:""}
  </form>`, "shared");
  const form = $("#schedForm");
  const upd = () => { const cyc = PATTERNS[form.pattern.value].cycle, st = parseD(form.start.value||ymd(mon)), first = form.first.value;
    $("#sc-strip").innerHTML = [...cyc].map((ch,i)=>{ const who = ch==="A"?first:otherOf(first); return `<span style="background:${who===S.uid?"var(--shared)":"var(--ink-3)"}" title="${ymd(addDays(st,i))}">${DOW[(i + (st.getDay()+6)%7) % 7].slice(0,1).toUpperCase()}</span>`; }).join("");
  };
  form.addEventListener("input", upd); form.addEventListener("change", upd); upd();
  form.onsubmit = async ev => { ev.preventDefault();
    const doc = {pattern:form.pattern.value, start:form.start.value, first:form.first.value};
    closeSheet(); await saveDocs("schedule", [doc], "main");
    notifyOther(`${me().label} lade in boendeschemat: ${PATTERNS[doc.pattern].label}.`); toast("Schemat är sparat"); };
}
function swapSheet(date){
  if (!otherId() && S.mode !== "demo") { toast(`Bjud in ${H().partner} först`); return; }
  const cur = stayAt(date);
  openSheet(`${sheetHead("Be om byte", `Just nu är barnen hos ${cur?stayName(cur):"–"} ${dayLow(date)}`)}
  <form id="swapForm" class="stack">
    <div class="two"><label class="field"><span>Från</span><input id="sw-start" type="date" name="start" required value="${date}"></label><label class="field"><span>Till och med</span><input id="sw-end" type="date" name="end" required value="${date}"></label></div>
    <label class="field"><span>Barnen ska vara hos</span><select id="sw-to" name="toParent"><option value="${esc(S.uid)}" ${cur!==S.uid?"selected":""}>Mig</option><option value="${esc(otherId()||"other")}" ${cur===S.uid?"selected":""}>${esc(otherLabel())}</option></select></label>
    <label class="field"><span>Meddelande (valfritt)</span><input id="sw-note" name="note" maxlength="120" placeholder="Ex. jag har en kurs den kvällen"></label>
    <button class="btn primary block" type="submit">Skicka förfrågan till ${esc(otherLabel())}</button></form>`, "shared");
  $("#swapForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target);
    let a = f.get("start"), b = f.get("end"); if (b < a) [a,b] = [b,a];
    if ((parseD(b)-parseD(a))/86400000 > 30) { toast("Välj högst 31 dagar åt gången"); return; }
    const doc = {from:S.uid, to:otherId()||"other", start:a, end:b, toParent:f.get("toParent"), note:(f.get("note")||"").trim(), status:"pending"};
    closeSheet(); await saveDocs("swaps", [doc]);
    notifyOther(`${me().label} undrar om barnen kan vara hos ${doc.toParent===S.uid?me().label:"dig"} ${fmtRange(a,b)}. Svara under Kalender.`);
    toast(`Förfrågan skickad till ${otherLabel()}`); };
}
async function answerSwap(id, yes){
  const x = S.swaps.find(s => s.id === id); if (!x) return;
  await saveDocs("swaps", [{status: yes ? "accepted" : "declined", answeredAt:Date.now()}], id);
  if (yes) {
    const days = []; for (let d = parseD(x.start); ymd(d) <= x.end; d = addDays(d,1)) days.push(ymd(d));
    const label = x.toParent === S.uid ? me().label : parentLabel(x.toParent);
    await saveDocs("events", days.map(k => ({title:x.name ? `${x.name}: barnen hos ${label}` : `Barnen hos ${label}`, date:k, start:"", end:"", kind:"boende", with:x.toParent, childIds:S.children.map(c=>c.id), note:x.name || "Byte"})));
  }
  if (S.mode !== "demo" && (S.space !== "hem" || S.dbHem)) collRef("notices").add({to:x.from, from:S.uid, text:`${me().label} ${yes?"sa ja till":"kunde tyvärr inte"} ${x.name ? x.name.toLowerCase() : "bytet"} ${fmtRange(x.start,x.end)}.${yes?" Kalendern är uppdaterad.":""}`, read:false, createdAt:Date.now()}).catch(()=>{});
  toast(yes ? `${x.name || "Bytet"} är godkänt och kalendern uppdaterad` : "Du har tackat nej");
}
function choresBlock(){
  const items = choreItems().sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999"));
  const today = ymd(new Date());
  return `<div class="section"><div class="row" style="margin-bottom:8px"><span class="eyebrow" style="flex:1">Sysslor</span>${canAct()?`<button class="btn" style="padding:6px 10px;font-size:13px" data-act="choreEdit">${IC.plus} Ny syssla</button>`:""}</div>
  <div class="list">${items.length ? items.map(c => { const who = personLabel(c.people?.[c.idx||0]), late = c.due && c.due < today, now = c.due === today;
    const nl = (c.people||[]).length > 1 ? personLabel(c.people[((c.idx||0)+1) % c.people.length]) : "";
    const nxt = nl ? ` · sedan ${nl === "Du" ? "du" : esc(nl)}` : "";
    return `<div class="item"><button class="check" data-act="choreDone" data-coll="${c._coll}" data-id="${esc(c.id)}" aria-label="Markera ${esc(c.name)} som gjord"></button>
      <button class="main" style="all:unset;flex:1;min-width:0;cursor:pointer" data-act="choreEdit" data-coll="${c._coll}" data-id="${esc(c.id)}"><div class="t">${esc(c.name)}</div><div class="s"><b>${who === "Du" ? "Din tur" : esc(who) + "s tur"}</b>${nxt} · ${esc((EVERY.find(e=>e[0]===Number(c.every))||[0,`var ${c.every}:e dag`])[1].toLowerCase())}</div>${c.lastAt?`<div class="s">Senast gjort av ${c.lastBy === "Du" ? "dig" : esc(c.lastBy||"")} ${new Date(c.lastAt).toLocaleDateString(LOC,{day:"numeric",month:"short"})}</div>`:""}</button>
      <span class="status ${late?"wait":now?"ok":"no"}">${dueLabel(c.due)}</span></div>`; }).join("") : `<div class="empty">Ex. dammsuga varje vecka, turas om mellan ${choresShared()?"er":"dig och barnen"}.</div>`}</div></div>`;
}
async function choreDone(coll, id){
  const c = localList(coll).find(x=>x.id===id); if (!c) return;
  const ppl = c.people?.length ? c.people : ["me"], idx = c.idx || 0, who = personLabel(ppl[idx]);
  const next = (idx + 1) % ppl.length, due = ymd(addDays(new Date(), Number(c.every)||7));
  await saveDocs(coll, [{idx:next, due, lastBy:who, lastAt:Date.now()}], id);
  toast(`Bra jobbat${who && who!=="Du" ? ", " + who : ""}! Nästa gång: ${personLabel(ppl[next])}, ${dayLow(due)}`);
}
function choreSheet(coll, id){
  coll = coll || (choresShared() ? "chores" : "my");
  const c = id ? localList(coll).find(x=>x.id===id) : null, opts = personOptions();
  const sel = c?.people || [opts[0]?.[0]];
  openSheet(`${sheetHead(c?"Ändra syssla":"Ny syssla", choresShared()?`Delas med ${esc(otherLabel())}`:"I din privata del")}<form id="choreForm" class="stack">
    <label class="field"><span>Vad ska göras?</span><input id="ch-name" name="name" required maxlength="40" value="${esc(c?.name||"")}" placeholder="Ex. Dammsuga"></label>
    <div class="two"><label class="field"><span>Hur ofta?</span><select id="ch-every" name="every">${EVERY.map(([n,l])=>`<option value="${n}" ${Number(c?.every||7)===n?"selected":""}>${l}</option>`).join("")}</select></label>
    <label class="field"><span>Nästa gång</span><input id="ch-due" type="date" name="due" value="${esc(c?.due||ymd(new Date()))}"></label></div>
    <div class="field"><span>Vilka turas om? (i den ordningen)</span><div class="chips">${opts.map(([k,l])=>`<label class="chip"><input type="checkbox" name="people" value="${esc(k)}" ${sel.includes(k)?"checked":""}>${esc(l)}</label>`).join("")}</div>
      ${!choresShared() && !myKids().length ? `<span class="small muted" style="font-weight:400">Lägg in dina barn under Mina barn så kan de vara med i turordningen.</span>` : ""}</div>
    <button class="btn primary block" type="submit">Spara</button>
    ${c?`<button class="btn danger block" type="button" data-act="del" data-coll="${coll}" data-id="${esc(c.id)}">Ta bort sysslan</button>`:""}</form>`, choresShared() ? "shared" : "mine");
  $("#choreForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target);
    const people = f.getAll("people"); if (!people.length) { toast("Välj minst en person"); return; }
    const doc = {name:cap(f.get("name")), every:Number(f.get("every")), due:f.get("due"), people, idx: c && c.people?.join() === people.join() ? (c.idx||0) : 0};
    if (coll === "my") doc.kind = "chore";
    closeSheet(); await saveDocs(coll, [doc], c?.id); toast("Sysslan är sparad"); };
}
function renderLov(){
  const lov = S.swaps.filter(x => x.name).sort((a,b)=>a.start.localeCompare(b.start));
  const years = [...new Set(lov.map(x => x.start.slice(0,4)))];
  const st = x => x.status === "accepted" ? `<span class="status ok">Klart</span>` : x.status === "declined" ? `<span class="status no">Nej</span>` : `<span class="status wait">Väntar</span>`;
  return `<div class="row" style="margin:6px 0 4px"><p class="small muted" style="margin:0;flex:1">Bestäm var barnen är på loven. ${esc(otherLabel())} godkänner, sedan läggs det in i kalendern.</p>${canAct()?`<button class="btn primary" data-act="lovNew">${IC.plus} Planera lov</button>`:""}</div>
    ${lov.filter(x=>x.status==="pending" && x.to===S.uid).map(x=>`<div style="margin-top:12px">${swapCard(x)}</div>`).join("")}
    ${years.length ? years.map(y => `<div class="lov-yr">${y}</div><div class="list">${lov.filter(x=>x.start.startsWith(y)).map(x=>`<div class="item"><span class="stayband" style="width:22px;flex:none;background:${x.toParent===S.uid?"var(--shared)":"var(--ink-3)"}"></span><div class="main"><div class="t">${esc(x.name)}</div><div class="s">${fmtRange(x.start,x.end)} · hos ${stayName(x.toParent)}${x.note?` · ${esc(x.note)}`:""}</div></div>${st(x)}${x.from===S.uid && x.status!=="accepted" && canAct()?`<button class="xbtn" data-act="swapCancel" data-id="${esc(x.id)}" aria-label="Ta bort">${IC.x}</button>`:""}</div>`).join("")}</div>`).join("")
      : `<div class="card empty" style="margin-top:12px">Inga lov planerade än. Börja t.ex. med jul och nyår.</div>`}`;
}
const LOV = ["Höstlov","Jullov","Julafton","Nyår","Sportlov","Påsklov","Sommarlov","Midsommar","Annat"];
function lovSheet(){
  if (!otherId() && S.mode !== "demo") { toast(`Bjud in ${H().partner} först`); return; }
  const y = new Date().getFullYear();
  openSheet(`${sheetHead("Planera lov", `${esc(otherLabel())} får en förfrågan att godkänna`)}<form id="lovForm" class="stack">
    <label class="field"><span>Vilket lov?</span><select id="lov-name" name="name">${LOV.map(l=>`<option value="${l}">${l}</option>`).join("")}</select></label>
    <label class="field" id="lov-otherwrap" hidden><span>Namn</span><input id="lov-other" name="other" maxlength="30" placeholder="Ex. Kalas hos mormor"></label>
    <div class="two"><label class="field"><span>Från</span><input id="lov-start" type="date" name="start" required value="${y}-12-22"></label><label class="field"><span>Till och med</span><input id="lov-end" type="date" name="end" required value="${y}-12-27"></label></div>
    <label class="field"><span>Barnen är hos</span><select id="lov-to" name="toParent"><option value="${esc(S.uid)}">Mig</option><option value="${esc(otherId()||"other")}">${esc(otherLabel())}</option></select></label>
    <label class="field"><span>Kommentar (valfritt)</span><input id="lov-note" name="note" maxlength="100" placeholder="Ex. vi åker till fjällen"></label>
    <button class="btn primary block" type="submit">Skicka till ${esc(otherLabel())}</button></form>`, "shared");
  const f0 = $("#lovForm"), y0 = new Date().getFullYear();
  const presets = {"Jullov":[`${y0}-12-22`,`${y0}-12-27`],"Julafton":[`${y0}-12-24`,`${y0}-12-24`],"Nyår":[`${y0}-12-31`,`${y0+1}-01-01`],"Höstlov":[`${y0}-10-26`,`${y0}-10-30`],"Sportlov":[`${y0+1}-02-16`,`${y0+1}-02-20`],"Påsklov":[`${y0+1}-04-06`,`${y0+1}-04-10`],"Sommarlov":[`${y0+1}-06-22`,`${y0+1}-07-12`],"Midsommar":[`${y0+1}-06-19`,`${y0+1}-06-21`]};
  f0.name.onchange = () => { const v = f0.name.value; $("#lov-otherwrap").hidden = v !== "Annat"; if (presets[v]) { f0.start.value = presets[v][0]; f0.end.value = presets[v][1]; } };
  f0.onsubmit = async ev => { ev.preventDefault(); const f = new FormData(f0);
    let a = f.get("start"), b = f.get("end"); if (b < a) [a,b] = [b,a];
    if ((parseD(b)-parseD(a))/86400000 > 70) { toast("Välj högst 10 veckor åt gången"); return; }
    const name = f.get("name") === "Annat" ? (cap(f.get("other")) || "Lov") : f.get("name");
    const doc = {name, from:S.uid, to:otherId()||"other", start:a, end:b, toParent:f.get("toParent"), note:(f.get("note")||"").trim(), status:"pending"};
    closeSheet(); await saveDocs("swaps", [doc]);
    notifyOther(`${me().label} föreslår ${name.toLowerCase()} ${fmtRange(a,b)}: barnen hos ${doc.toParent===S.uid?me().label:"dig"}. Svara under Lov.`);
    toast(`Förslaget är skickat till ${otherLabel()}`); };
}
function handoverSheet(date){
  const nc = nextChange(), d = date || nc?.date || ymd(new Date());
  const chips = ["Har haft feber","Har fått medicin kl ","Har läxa till ","Har glömt ","Har sovit dåligt","Har ont i ","Har varit glad och pigg"];
  openSheet(`${sheetHead(`Hälsning till ${esc(otherLabel())}`, "Visas för hen inför bytet")}<form id="hoForm" class="stack">
    <div class="chips">${chips.map(c=>`<button type="button" class="chip" data-ins="${esc(c)}">${esc(c.trim())}</button>`).join("")}</div>
    <label class="field"><span>Meddelande</span><textarea id="ho-text" name="text" rows="5" required maxlength="600" placeholder="Ex. Noah har varit förkyld, fick Alvedon kl 14. Ella har läxa till torsdag."></textarea></label>
    <label class="field"><span>Gäller bytet</span><input id="ho-date" type="date" name="date" value="${d}"></label>
    <button class="btn primary block" type="submit">Skicka hälsningen</button></form>`, "shared");
  document.querySelectorAll("[data-ins]").forEach(b => b.onclick = () => { const ta = $("#ho-text"), add = b.dataset.ins.trim(); ta.value = (ta.value.trim() ? ta.value.trim() + (/[.!?]$/.test(ta.value.trim()) ? " " : ". ") : "") + b.dataset.ins; ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); });
  $("#hoForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target), text = f.get("text").trim(); if (!text) return;
    closeSheet(); await saveDocs("handover", [{from:S.uid, to:otherId()||"other", date:f.get("date"), text, read:false}]);
    notifyOther(`${me().label} har skrivit en hälsning inför bytet: "${text.slice(0,80)}${text.length>80?"…":""}"`);
    toast(`Hälsningen är skickad till ${otherLabel()}`); };
}
function goalsSection(){
  const gs = S.my.filter(d => d.kind === "goal");
  return `<div class="section"><div class="row" style="margin-bottom:8px"><span class="eyebrow" style="flex:1">Sparmål</span>${canAct()?`<button class="btn" style="padding:6px 10px;font-size:13px" data-act="goalEdit">${IC.plus} Nytt mål</button>`:""}</div>
  ${gs.length ? `<div class="stack">${gs.map(g => { const pct = g.target ? Math.min(100, g.saved/g.target*100) : 0, left = Math.max(0, g.target - g.saved);
    let per = ""; if (g.deadline && left > 0) { const mths = Math.max(1, (parseD(g.deadline).getFullYear()-new Date().getFullYear())*12 + parseD(g.deadline).getMonth() - new Date().getMonth()); per = `Spara ${fmtKr(Math.ceil(left/mths))}/mån för att nå målet till ${parseD(g.deadline).toLocaleDateString(LOC,{month:"long",year:"numeric"})}.`; }
    return `<div class="card goal"><div class="row"><b style="flex:1">${esc(g.name)}</b>${canAct()?`<button class="btn" style="padding:6px 10px;font-size:13px" data-act="goalDeposit" data-id="${esc(g.id)}">Sätt in</button><button class="xbtn" data-act="goalEdit" data-id="${esc(g.id)}" aria-label="Ändra ${esc(g.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>`:""}</div>
      <div class="stat"><span class="big" style="font-size:24px">${fmtKr(g.saved)}</span><span class="muted">av ${fmtKr(g.target)} · ${pct.toFixed(0)} %</span></div>
      <div class="prog" style="margin-top:0"><div style="width:${pct}%"></div></div>
      <div class="small muted">${left > 0 ? `${fmtKr(left)} kvar.${per ? " " + per : ""}` : "<b style='color:var(--good)'>Målet är nått!</b>"}</div></div>`; }).join("")}</div>`
    : `<div class="card empty">Spara till något, t.ex. en resa eller en buffert. Du ser hur mycket som är kvar och hur mycket du behöver spara per månad.</div>`}</div>`;
}
function goalSheet(id){
  const g = id ? S.my.find(d=>d.id===id) : null;
  openSheet(`${sheetHead(g?"Ändra sparmål":"Nytt sparmål")}<form id="goalForm" class="stack">
    <label class="field"><span>Vad sparar du till?</span><input id="gl-name" name="name" required maxlength="40" value="${esc(g?.name||"")}" placeholder="Ex. Resa, buffert, ny soffa"></label>
    <div class="two"><label class="field"><span>Mål (kr)</span><input id="gl-target" name="target" inputmode="numeric" required value="${g?.target??""}"></label>
    <label class="field"><span>Redan sparat (kr)</span><input id="gl-saved" name="saved" inputmode="numeric" value="${g?.saved??0}"></label></div>
    <label class="field"><span>Klart till (valfritt)</span><input id="gl-deadline" type="date" name="deadline" value="${esc(g?.deadline||"")}"></label>
    <button class="btn primary block" type="submit">Spara</button>
    ${g?`<button class="btn danger block" type="button" data-act="del" data-coll="my" data-id="${esc(g.id)}">Ta bort sparmålet</button>`:""}</form>`, "mine");
  $("#goalForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target), target = parseAmount(f.get("target")); if (!target) { toast("Fyll i ett mål"); return; }
    closeSheet(); await saveDocs("my", [{kind:"goal", name:cap(f.get("name")), target, saved:parseAmount(f.get("saved")), deadline:f.get("deadline")||"", history:g?.history||[]}], g?.id); toast("Sparmålet är sparat"); };
}
function depositSheet(id){
  const g = S.my.find(d=>d.id===id); if (!g) return;
  openSheet(`${sheetHead(esc(g.name), `${fmtKr(g.saved)} av ${fmtKr(g.target)}`)}<form id="depForm" class="stack">
    <label class="field"><span>Belopp (kr)</span><input id="dep-amt" name="amount" inputmode="decimal" required placeholder="Ex. 1000"></label>
    <div class="btnrow"><button class="btn primary" type="submit" name="dir" value="in">Sätt in</button><button class="btn" type="submit" name="dir" value="out">Ta ut</button></div>
    ${(g.history||[]).length?`<div class="list">${[...g.history].reverse().slice(0,8).map(h=>`<div class="item"><div class="main"><div class="t">${h.amount>0?"Insättning":"Uttag"}</div><div class="s">${dayLabel(h.date)}</div></div><div class="amt" style="color:${h.amount>0?"var(--good)":"var(--ink-2)"}">${h.amount>0?"+":""}${fmtKr(h.amount)}</div></div>`).join("")}</div>`:""}</form>`, "mine");
  $("#depForm").onsubmit = async ev => { ev.preventDefault(); const amt = parseAmount($("#dep-amt").value); if (!amt) return;
    const sign = ev.submitter?.value === "out" ? -1 : 1, change = sign * amt;
    closeSheet(); await saveDocs("my", [{saved:Math.max(0, (Number(g.saved)||0) + change), history:[...(g.history||[]), {amount:change, date:ymd(new Date())}].slice(-60)}], g.id);
    const ng = (Number(g.saved)||0) + change;
    toast(ng >= g.target && change > 0 ? `Grattis! Du har nått målet ${g.name}` : sign > 0 ? `${fmtKr(amt)} insatt` : `${fmtKr(amt)} uttaget`); };
}
/* ----- dinner ideas ----- */
const FALLBACK_DISHES = [
  {name:"Köttfärssås med spaghetti", minutes:30, description:"Klassiker som alla barn gillar.", ingredients:[["Köttfärs","500 g"],["Krossade tomater","2 burkar"],["Gul lök","1 st"],["Vitlök","2 klyftor"],["Spaghetti","500 g"],["Riven ost","1 påse"],["Salt och peppar","",1],["Olja","",1]]},
  {name:"Krämig kycklinggryta med ris", minutes:30, description:"En gryta som går snabbt en vardag.", ingredients:[["Kycklingfilé","600 g"],["Matlagningsgrädde","2,5 dl"],["Paprika","2 st"],["Gul lök","1 st"],["Ris","4 portioner"],["Buljongtärning","1 st",1]]},
  {name:"Fiskpinnar med potatismos", minutes:25, description:"Snabbt, enkelt och barnvänligt.", ingredients:[["Fiskpinnar","1 paket"],["Potatis","1 kg"],["Mjölk","2 dl"],["Smör","50 g",1],["Ärtor","1 påse"],["Remouladsås","1 tub"]]},
  {name:"Tacos", minutes:25, description:"Fredagsmys eller en enkel vardag.", ingredients:[["Köttfärs","500 g"],["Tacokrydda","1 påse"],["Tortillabröd","1 paket"],["Gurka","1 st"],["Tomat","3 st"],["Majs","1 burk"],["Riven ost","1 påse"],["Tacosås","1 burk"]]},
  {name:"Linsgryta med kokos", minutes:30, description:"Vegetariskt, billigt och mättande.", veg:true, ingredients:[["Röda linser","3 dl"],["Kokosmjölk","1 burk"],["Krossade tomater","1 burk"],["Gul lök","1 st"],["Curry","",1],["Ris","4 portioner"]]},
  {name:"Laxpasta med spenat", minutes:20, description:"Färdig på 20 minuter.", ingredients:[["Laxfilé","400 g"],["Pasta","500 g"],["Matlagningsgrädde","2,5 dl"],["Bladspenat","1 påse"],["Citron","1 st"]]},
  {name:"Pannkakor med sylt", minutes:30, description:"Torsdagsklassikern.", veg:true, ingredients:[["Vetemjöl","2,5 dl",1],["Mjölk","6 dl"],["Ägg","3 st"],["Sylt","1 burk"],["Smör","",1]]},
  {name:"Halloumiwraps", minutes:20, description:"Vegetariskt och snabbt.", veg:true, ingredients:[["Halloumi","2 paket"],["Tortillabröd","1 paket"],["Sallad","1 påse"],["Tomat","2 st"],["Tzatziki","1 burk"]]}
];
function dinnerSheet(){
  const allergies = [...new Set(S.children.map(c => c.info?.allergies).filter(Boolean))].join(", ");
  const d = S.dinner || {};
  openSheet(`${sheetHead("Middagstips", `Förslag med ingredienser som du lägger på ${shopShared() ? "er gemensamma inköpslista" : "inköpslistan"}`)}
   <form id="dinForm" class="stack">
    <label class="field"><span>Vad vill du ha tips på?</span><input id="din-q" name="q" maxlength="200" value="${esc(d.q || tr("5 enkla vardagsrätter"))}" autocomplete="off"></label>
    <div class="chips">${["Barnvänligt","Vegetariskt","Under 30 minuter","Billigt","Matlådevänligt","Fisk"].map(c=>`<label class="chip"><input type="checkbox" name="tags" value="${c}" ${(d.tags||[]).includes(c)?"checked":""}>${c}</label>`).join("")}</div>
    <div class="two"><label class="field"><span>Antal portioner</span><input id="din-portions" name="portions" type="number" min="1" max="12" value="${d.portions || (H().kids ? 4 : 2)}"></label>
    ${allergies ? `<label class="row small" style="align-self:end;padding-bottom:10px"><input id="din-allergy" type="checkbox" name="allergy" ${d.allergy===false?"":"checked"}> Undvik: ${esc(allergies)}</label>` : "<span></span>"}</div>
    <button class="btn primary block" type="submit">Ge mig förslag</button>
   </form>
   <div id="din-results" class="stack" style="margin-top:14px">${dinnerResults()}</div>`, shopShared() ? "shared" : "mine");
  $("#dinForm").onsubmit = ev => { ev.preventDefault(); askDinner(); };
  refreshDinner();
}
function dinnerResults(){
  const d = S.dinner; if (!d?.dishes?.length) return "";
  const openNames = shopItems().filter(x => !x.done).map(x => x.text.toLowerCase());
  return `${d.note ? `<div class="ai"><span>i</span><span>${esc(d.note)}</span></div>` : ""}
    ${d.dishes.map((dish, i) => `<div class="dish"><div class="dish-head"><div style="flex:1"><b>${esc(dish.name)}</b>${dish.minutes?` <span class="tag">${Number(dish.minutes)} min</span>`:""}<p>${esc(dish.description||"")}</p></div></div>
      <div class="lines">${dish.ingredients.map((g, j) => { const have = openNames.some(n => n.startsWith(g.item.toLowerCase()));
        return `<label class="${g.pantry?"pantry":""}"><input type="checkbox" data-ing="${i}|${j}" ${d.sel[i+"|"+j] ? "checked" : ""}><span>${esc(g.item)}${g.amount?` <span class="muted">· ${esc(g.amount)}</span>`:""}${g.pantry?` <span class="muted">· finns oftast hemma</span>`:""}${have?` <span class="muted">· står redan på listan</span>`:""}</span></label>`; }).join("")}</div>
      <div class="dish-foot"><span class="small muted" style="flex:1">${dish.added ? "Inlagd på inköpslistan" : ""}</span><button class="btn${dish.added?"":" primary"}" data-act="dinAdd" data-d="${i}">${dish.added ? "Lägg in igen" : "Lägg in i inköpslistan"}</button></div></div>`).join("")}
    ${d.dishes.length > 1 ? `<button class="btn primary block" data-act="dinAdd" data-d="all">Lägg in alla rätter (${d.dishes.length})</button>` : ""}`;
}
function refreshDinner(){ const r = $("#din-results"); if (r) { r.innerHTML = dinnerResults(); r.querySelectorAll("[data-ing]").forEach(cb => cb.onchange = () => { S.dinner.sel[cb.dataset.ing] = cb.checked; }); } }
async function askDinner(){
  const f = $("#dinForm"); if (!f) return;
  const fd = new FormData(f), q = (fd.get("q") || "").trim() || tr("5 enkla vardagsrätter"), tags = fd.getAll("tags"), portions = Math.min(12, Math.max(1, Number(fd.get("portions")) || 4));
  const allergies = fd.get("allergy") ? [...new Set(S.children.map(c => c.info?.allergies).filter(Boolean))].join(", ") : "";
  S.dinner = {q, tags, portions, allergy: !!fd.get("allergy"), dishes:[], sel:{}};
  const box = $("#din-results"); box.innerHTML = `<div class="ai"><span class="spin"></span><span>${S.sample ? "Tänker ut middagar…" : "Hämtar förslag…"}</span></div>`;
  let dishes = null, note = "";
  if (S.sample) {
    const prompt = `Du är en matplanerare för en vanlig familj i Norden. Skriv rätternas namn, beskrivningar och ingredienser på ${aiLang()}. Förfrågan: "${q}".${tags.length ? ` Önskemål: ${tags.join(", ")}.` : ""} Portioner per rätt: ${portions}.${allergies ? ` Rätterna får inte innehålla: ${allergies}.` : ""}
Föreslå vardagsrätter med ingredienser som finns i en vanlig mataffär. Antal rätter: det som efterfrågas, annars 5, högst 7. Ange mängder för ${portions} portioner i vanliga förpackningar (t.ex. "500 g", "1 burk", "2 st").
Svara med ENDAST JSON: {"dishes":[{"name":"rättens namn","minutes":30,"description":"en kort mening","ingredients":[{"item":"varans namn med stor bokstav","amount":"mängd","pantry":false}]}]}
pantry ska vara true för basvaror som de flesta har hemma: salt, peppar, olja, smör, vetemjöl, socker, torkade kryddor och buljong.`;
    try { const r = await S.sample.json(prompt); if (Array.isArray(r?.dishes) && r.dishes.length) dishes = r.dishes; }
    catch(e) { note = e?.code === "rate_limited" ? "AI:n är upptagen just nu, så här är några vanliga förslag i stället." : e?.code === "not_granted" ? "AI-tips är inte tillåtet, så här är några vanliga förslag i stället." : "AI:n svarade inte, så här är några vanliga förslag i stället."; }
  } else note = "AI är inte tillgänglig här, så här är några vanliga förslag.";
  if (!dishes) {
    const n = Math.min(7, Number((q.match(/\d+/)||[])[0]) || 5), veg = tags.includes("Vegetariskt") || /vegetar|vego/i.test(q), fish = tags.includes("Fisk") || /fisk/i.test(q);
    let pool = FALLBACK_DISHES.filter(x => !veg || x.veg);
    if (fish) pool = [...pool.filter(x => /fisk|lax/i.test(x.name)), ...pool.filter(x => !/fisk|lax/i.test(x.name))];
    dishes = pool.slice(0, n).map(x => ({name:x.name, minutes:x.minutes, description:x.description, ingredients:x.ingredients.map(([item, amount, pantry]) => ({item, amount, pantry:!!pantry}))}));
  }
  S.dinner.note = note;
  S.dinner.dishes = dishes.slice(0,7).map(x => ({name:String(x.name||"Rätt").slice(0,60), minutes:Number(x.minutes)||0, description:String(x.description||"").slice(0,140),
    ingredients:(Array.isArray(x.ingredients)?x.ingredients:[]).filter(g => g && g.item).slice(0,20).map(g => ({item:cap(String(g.item)).slice(0,50), amount:String(g.amount||"").slice(0,30), pantry:!!g.pantry}))}));
  S.dinner.dishes.forEach((dish, i) => dish.ingredients.forEach((g, j) => { S.dinner.sel[i+"|"+j] = !g.pantry; }));
  refreshDinner();
}
async function addDinner(only){
  const d = S.dinner; if (!d) return;
  const openNames = shopItems().filter(x => !x.done).map(x => x.text.toLowerCase());
  const docs = [], seen = new Map(); let skipped = 0;
  d.dishes.forEach((dish, i) => {
    if (only != null && i !== only) return;
    dish.ingredients.forEach((g, j) => {
      if (!d.sel[i+"|"+j]) return;
      const key = g.item.toLowerCase();
      if (openNames.some(n => n.startsWith(key))) { skipped++; return; }
      if (seen.has(key)) { const e = seen.get(key); if (g.amount) e.amounts.push(g.amount); e.doc.text = `${g.item}${e.amounts.length ? ` (${e.amounts.join(" + ")})` : ""}`; return; }
      const doc = {text:`${g.item}${g.amount ? ` (${g.amount})` : ""}`, childName:"", group:"mat", done:false};
      seen.set(key, {doc, amounts: g.amount ? [g.amount] : []}); docs.push(doc);
    });
    dish.added = true;
  });
  if (docs.length) await saveDocs(shopShared() ? "shop" : "my", shopShared() ? docs : docs.map(x => ({kind:"shop", ...x})));
  refreshDinner();
  toast(docs.length ? `${docs.length} varor på inköpslistan${skipped ? ` (${skipped} fanns redan)` : ""}` : "Allt fanns redan på listan");
}
function recurListSheet(){
  const rs = S.my.filter(d=>d.kind==="recur").sort((a,b)=>Number(b.amount)-Number(a.amount));
  const nowYm = ymd(new Date()).slice(0,7), active = rs.filter(r=>!r.end || r.end >= nowYm);
  openSheet(`${sheetHead("Fasta kostnader", "Läggs in i budgeten automatiskt varje månad")}
   <div class="stack"><div class="stat"><span class="big" style="font-size:26px">${fmtKr(active.reduce((a,r)=>a+Number(r.amount||0),0))}</span><span class="muted">per månad</span></div>
   <div class="list">${rs.length ? rs.map(r=>`<button class="item" data-act="recurEdit" data-id="${esc(r.id)}"><div class="cat-ic">${esc((r.name||"?").slice(0,1).toUpperCase())}</div><div class="main"><div class="t">${esc(r.name)}</div><div class="s">${esc(r.category)} · den ${Math.min(28,Number(r.day)||1)} varje månad${r.end?` · t.o.m. ${esc(r.end)}`:""}${r.end && r.end < nowYm ? " · avslutad" : ""}</div></div><div class="amt">${fmtKr(r.amount)}</div></button>`).join("") : `<div class="empty">Ex. hyra, el, försäkringar, Netflix eller underhållsbidrag.</div>`}</div>
   <button class="btn primary block" data-act="recurEdit">${IC.plus} Ny fast kostnad</button></div>`, "mine");
}
function recurSheet(id){
  const r = id ? S.my.find(d=>d.id===id) : null;
  openSheet(`${sheetHead(r?"Ändra fast kostnad":"Ny fast kostnad")}<form id="recForm" class="stack">
    <label class="field"><span>Vad?</span><input id="rc-name" name="name" required maxlength="40" value="${esc(r?.name||"")}" placeholder="Ex. Hyra"></label>
    <div class="two"><label class="field"><span>Belopp per månad (kr)</span><input id="rc-amount" name="amount" inputmode="decimal" required value="${r?.amount??""}"></label>
    <label class="field"><span>Dag i månaden</span><input id="rc-day" name="day" type="number" min="1" max="28" value="${r?.day??25}"></label></div>
    <label class="field"><span>Kategori</span><select id="rc-cat" name="category">${MY_CATS.map(c=>`<option value="${esc(c)}" ${(r?.category||"Boende")===c?"selected":""}>${c}</option>`).join("")}</select></label>
    <div class="two"><label class="field"><span>Från månad</span><input id="rc-start" type="month" name="start" required value="${esc(r?.start||ymd(new Date()).slice(0,7))}"></label>
    <label class="field"><span>Till månad (valfritt)</span><input id="rc-end" type="month" name="end" value="${esc(r?.end||"")}"></label></div>
    <button class="btn primary block" type="submit">Spara</button>
    ${r?`<button class="btn danger block" type="button" data-act="del" data-coll="my" data-id="${esc(r.id)}">Ta bort</button><p class="small muted" style="margin:0">Vill du bara sluta betala? Fyll i "Till månad" så finns historiken kvar i budgeten.</p>`:""}</form>`, "mine");
  $("#recForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target), amt = parseAmount(f.get("amount")); if (!amt) { toast("Fyll i ett belopp"); return; }
    closeSheet(); await saveDocs("my", [{kind:"recur", name:f.get("name").trim(), amount:amt, day:Math.min(28,Math.max(1,Number(f.get("day"))||1)), category:f.get("category"), start:f.get("start"), end:f.get("end")||""}], r?.id);
    toast("Sparat – syns i budgeten"); recurListSheet(); };
}
function meSheet(first){
  openSheet(`${sheetHead(first?"Välkommen till Vardagen":"Ditt namn", first?`Här delar du kalender och kostnader med ${H().partner}. Det du lägger under Mitt ser bara du.`:"")}<form id="meForm" class="stack">
    <label class="field"><span>Vad ska du heta i appen?</span><input id="me-label" name="label" required maxlength="24" value="${esc(S.parents[S.uid]?.label||"")}" placeholder="Ex. Mamma, Pappa eller ditt namn"></label>
    <div class="chips">${(H().kids?["Mamma","Pappa"]:[]).map(n=>`<button type="button" class="chip" data-fill="${n}">${n}</button>`).join("")}</div>
    <button class="btn primary block" type="submit">${first?"Kom igång":"Spara"}</button></form>`, "shared");
  document.querySelectorAll("[data-fill]").forEach(b => b.onclick = () => { $("#me-label").value = b.dataset.fill; });
  $("#meForm").onsubmit = async ev => { ev.preventDefault(); const label = new FormData(ev.target).get("label").trim();
    closeSheet(); await saveDocs("parents", [{label, joinedAt:S.parents[S.uid]?.joinedAt || Date.now()}], S.uid);
    if (first && otherId()) notifyOther(`${label} har gått med i Vardagen.`); };
}
async function inviteSheet(){
  if (S.mode !== "live") { toast("Inbjudningar fungerar när du är inloggad"); return; }
  const spaceId = S.space === "hem" ? window.Vardagen.ctx.hemSpaceId : window.Vardagen.ctx.spaceId;
  openSheet(`${sheetHead(`Bjud in ${esc(H().partner)}`, "Skickas med sms, mejl eller annan app")}<div id="inv-body" class="ai"><span class="spin"></span><span>Skapar länken…</span></div>`, S.space === "hem" ? "shared" : "shared");
  try {
    const link = await window.Vardagen.inviteLink(spaceId);
    const msg = tr(`Hej! Jag har bjudit in dig till ${H().space} i appen Vardagen. Öppna länken för att gå med:`);
    const box = $("#inv-body"); if (!box) return;
    box.outerHTML = `<div class="stack"><div class="card" style="overflow-wrap:anywhere;font-variant-numeric:tabular-nums"><b>${esc(link)}</b></div>
      <div class="btnrow">${navigator.share ? `<button class="btn primary" data-act="shareLink" data-t="${esc(link)}" data-msg="${esc(msg)}">Dela länken</button>` : ""}<button class="btn" data-act="copyLink" data-t="${esc(link)}">Kopiera länken</button></div>
      <p class="small muted" style="margin:0">Länken gäller i 14 dagar och kan användas en gång. Den ger bara tillgång till ${esc(H().space)}, aldrig till din privata del.</p></div>`;
  } catch(e) { const box = $("#inv-body"); if (box) box.innerHTML = `<span>!</span><span>Kunde inte skapa länken. Kontrollera internetanslutningen och försök igen.</span>`; }
}
function setupSheet(first){
  const cur = settings().household || "", name = S.parents[S.uid]?.label || settings().name || "";
  openSheet(`${sheetHead(first?"Välkommen till Vardagen":"Inställningar", first?"Berätta hur du bor, så anpassar vi appen efter dig. Du kan ändra det senare.":"")}
  <form id="setupForm" class="stack">
    <div class="field"><span>Språk</span><div class="chips">${Object.entries(LANGS).map(([k,l])=>`<label class="chip"><input type="radio" name="lang" value="${k}" ${k===LANG?"checked":""}>${l.name}</label>`).join("")}</div></div>
    <div class="stack" role="radiogroup" aria-label="Hur bor du?"><span class="eyebrow">Hur bor du?</span>
    ${Object.entries(HH).map(([k,h])=>`<label class="hh"><input type="radio" name="hh" value="${k}" ${cur===k?"checked":""} required><div class="cat-ic">${IC[h.icon]}</div><div><b>${h.label}</b><span class="s">${h.desc}${h.shared?` <span class="own">+ din privata del</span>`:""}</span></div></label>`).join("")}</div>
    <label class="field"><span>Vad ska du heta i appen?</span><input id="setup-name" name="name" maxlength="24" value="${esc(name)}" placeholder="Ditt förnamn, eller t.ex. Mamma"></label>
    <button type="button" class="btn block" data-act="myKids">${IC.kids} Mina barn i Mitt${myKids().length?` (${myKids().map(k=>esc(k.name)).join(", ")})`:""}</button>
    <p class="small muted" style="margin:0">Din privata del heter <b>Mitt</b>. Där har du egen kalender, budget, kvitton och listor som bara du ser.</p>
    <button class="btn primary block" type="submit">${first?"Kom igång":"Spara"}</button>
    ${S.mode === "live" ? `<div class="card stack" style="gap:8px"><span class="eyebrow">Konto</span><span class="small muted">Inloggad som <b>${esc(window.Vardagen?.ctx?.email || "")}</b></span><button type="button" class="btn block" data-act="logout">Logga ut</button></div>` : `<button type="button" class="btn block" data-act="login">Logga in eller skapa konto</button>`}
    </form>`, "shared");
  $("#setupForm").addEventListener("change", ev => {
    if (ev.target.name !== "lang") return;
    const f = $("#setupForm"), hh = f.querySelector('input[name="hh"]:checked')?.value, nm = f.name.value;
    setLang(ev.target.value); setupSheet(first);
    const g = $("#setupForm"); if (hh) { const r = g.querySelector(`input[name="hh"][value="${hh}"]`); if (r) r.checked = true; } g.name.value = nm;
  });
  $("#setupForm").onsubmit = async ev => {
    ev.preventDefault(); const f = new FormData(ev.target), hh = f.get("hh"), label = (f.get("name")||"").trim();
    if (!hh) return;
    const wasShared = H().shared;
    closeSheet();
    await saveDocs("my", [{kind:"settings", household:hh, name:label}], "settings");
    if (S.mode === "demo") { const [a,b] = HH[hh].demo; S.parents = b ? {u_me:{label:label||a}, u_other:{label:b}} : {u_me:{label:label||a}}; render(); }
    else if (HH[hh].shared && (label || !S.parents[S.uid])) {
      if (label) await saveDocs("parents", [{label, joinedAt:S.parents[S.uid]?.joinedAt || Date.now()}], S.uid);
      else meSheet(true);
    }
    if (!HH[hh].shared && S.view === "shared") { S.view = "home"; remember(); render(); }
    toast(first ? "Klart! Appen är anpassad efter dig." : HH[hh].shared && !wasShared ? `Nu finns ${HH[hh].space} på startsidan` : "Sparat");
  };
}
function projSheet(id){
  const p = id ? myProjects().find(x=>x.id===id) : null;
  openSheet(`${sheetHead(p?"Ändra projekt":"Nytt projekt")}<form id="projForm" class="stack">
    <label class="field"><span>Namn</span><input id="pr-name" name="name" required maxlength="40" value="${esc(p?.name||"")}" placeholder="Ex. Nytt kök"></label>
    <div class="two"><label class="field"><span>Budget (kr)</span><input id="pr-budget" name="budget" inputmode="numeric" value="${p?.budget??""}"></label><label class="field"><span>Start</span><input id="pr-start" type="date" name="start" value="${esc(p?.start||ymd(new Date()))}"></label></div>
    ${p?`<label class="row"><input id="pr-done" type="checkbox" name="done" ${p.status==="done"?"checked":""}> Projektet är klart</label>`:""}
    <button class="btn primary block" type="submit">Spara</button>
    ${p?`<button class="btn danger block" type="button" data-act="del" data-coll="my" data-id="${esc(p.id)}">Ta bort projektet</button><p class="small muted" style="margin:0">Kvittona finns kvar i budgeten om du tar bort projektet.</p>`:""}</form>`, "mine");
  $("#projForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target);
    closeSheet(); await saveDocs("my", [{kind:"proj", name:f.get("name").trim(), budget:parseAmount(f.get("budget")), start:f.get("start"), status:f.get("done")?"done":"active"}], p?.id); toast("Projektet är sparat"); };
}
function projDetail(id){
  const p = myProjects().find(x=>x.id===id); if (!p) return;
  const ex = myExp().filter(e=>e.project===id).sort((a,b)=>b.date.localeCompare(a.date)), spent = ex.reduce((s,e)=>s+Number(e.amount||0),0);
  openSheet(`${sheetHead(esc(p.name), p.start?`Startade ${parseD(p.start).toLocaleDateString(LOC,{day:"numeric",month:"long",year:"numeric"})}`:"")}
   <div class="stack"><div class="stat"><span class="big">${fmtKr(spent)}</span>${p.budget?`<span class="muted">av ${fmtKr(p.budget)}</span>`:""}</div>
   ${p.budget?`<div class="prog"><div class="${spent>p.budget?"over":""}" style="width:${Math.min(100,spent/p.budget*100)}%"></div></div>`:""}
   <div class="btnrow">${canAct()?`<button class="btn primary" data-act="scanProj" data-id="${esc(p.id)}">${IC.camera} Lägg till kvitto</button><button class="btn" data-act="editProj" data-id="${esc(p.id)}">Ändra</button>`:""}</div>
   <div class="list">${ex.length?ex.map(e=>expenseItem(e,"mine")).join(""):`<div class="empty">Inga kvitton kopplade än.</div>`}</div></div>`, "mine");
}
function budgetSheet(){
  const b = settings().budgets || {};
  openSheet(`${sheetHead("Månadsbudget", "Lämna tomt för kategorier utan budget")}<form id="budForm" class="stack">
    ${MY_CATS.filter(c=>c!=="Renovering").map((c,i)=>`<label class="row"><span style="flex:1">${c}</span><input id="bud-${i}" name="${esc(c)}" inputmode="numeric" value="${b[c]??""}" placeholder="kr/mån" style="width:120px;border:1px solid var(--line);border-radius:10px;padding:9px 10px;background:var(--surface);text-align:right"></label>`).join("")}
    <button class="btn primary block" type="submit">Spara budget</button></form>`, "mine");
  $("#budForm").onsubmit = async ev => { ev.preventDefault(); const f = new FormData(ev.target), budgets = {};
    for (const [k,v] of f.entries()) { const n = parseAmount(v); if (n) budgets[k] = n; }
    closeSheet(); await saveDocs("my", [{kind:"settings", budgets}], "settings"); toast("Budgeten är sparad"); };
}
function noticesSheet(){
  const mine = S.notices.filter(n=>n.to===S.uid).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,40);
  openSheet(`${sheetHead("Notiser", "Händelser och kvitton från "+esc(otherLabel()))}<div class="list">${mine.length?mine.map(noticeItem).join(""):`<div class="empty">Inga notiser än. När ${esc(otherLabel())} lägger in ett kvitto eller en händelse syns det här.</div>`}</div>
   <p class="small muted">Notiserna visas när du öppnar appen. Riktiga push-notiser till telefonen kräver en installerad app.</p>`, "shared");
  markRead(mine.filter(n=>!n.read));
}
async function markRead(list){
  if (S.mode === "demo" || (S.space === "hem" && !S.dbHem)) { list.forEach(n=>n.read=true); render(); return; }
  for (const n of list) { try { await collRef("notices").doc(n.id).update({read:true}); } catch(e){} }
}
function confirmDelete(coll, id){
  const btn = document.querySelector(`[data-act="del"][data-id="${CSS.escape(id)}"]`);
  if (btn && !btn.dataset.armed) { btn.dataset.armed = "1"; btn.textContent = "Tryck igen för att ta bort"; return; }
  closeSheet(); removeDoc(coll, id).then(()=>toast("Borttaget"));
}

/* ---------- family calendar from the home screen ---------- */
const WD_ALL = [["söndag","søndag","sunday"],["måndag","mandag","monday"],["tisdag","tirsdag","tuesday"],["onsdag","wednesday"],["torsdag","thursday"],["fredag","friday"],["lördag","lørdag","saturday"]];
const MON_ALL = {jan:0,feb:1,mar:2,apr:3,maj:4,mai:4,may:4,jun:5,jul:6,aug:7,sep:8,okt:9,oct:9,nov:10,dec:11,des:11};
const WB = "(^|[^a-zåäöæøé])", WE = "($|[^a-zåäöæøé])";
const wordRe = alts => new RegExp(WB + "(" + alts + ")" + WE);
function parseSvDate(text){
  const low = text.toLowerCase(), t = new Date(); t.setHours(0,0,0,0);
  const near = (d, mo, dd) => { let x = new Date(d.getFullYear(), mo, dd); if (x < addDays(d,-30)) x = new Date(d.getFullYear()+1, mo, dd); return ymd(x); };
  if (wordRe("i\\s?övermorgon|i\\s?overmorgen|overmorgen|day after tomorrow").test(low)) return ymd(addDays(t,2));
  if (wordRe("i\\s?morgon|i\\s?morgen|tomorrow").test(low)) return ymd(addDays(t,1));
  if (wordRe("idag|i dag|ikväll|i kväll|i kveld|i aften|today|tonight").test(low)) return ymd(t);
  const mn = "jan|feb|mar|apr|maj|mai|may|jun|jul|aug|sep|okt|oct|nov|dec|des";
  let m = low.match(new RegExp("(\\d{1,2})\\s*(?::e|e|\\.|st|nd|rd|th)?\\s*(?:of\\s+)?(" + mn + ")[a-zåäöæø]*"));
  if (m) return near(t, MON_ALL[m[2]], Number(m[1]));
  m = low.match(new RegExp("(" + mn + ")[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?!\\d)"));
  if (m) return near(t, MON_ALL[m[1]], Number(m[2]));
  m = low.match(/(?:^|[^\d])(\d{1,2})\/(\d{1,2})(?!\d)/);
  if (m) return near(t, Number(m[2])-1, Number(m[1]));
  const wi = WD_ALL.findIndex(names => wordRe(names.map(w => w + "(?:en)?").join("|")).test(low));
  if (wi >= 0) { let n = (wi - t.getDay() + 7) % 7; if (n === 0) n = 7; return ymd(addDays(t,n)); }
  return null;
}
function parseSvTime(text){
  const m = text.toLowerCase().match(/(?:kl\.?|klockan|klokka|klokken|at)\s*(\d{1,2})(?:[:.](\d{2}))?(?:\s*(?:-|–|till|til|to)\s*(\d{1,2})(?:[:.](\d{2}))?)?/);
  if (!m) return {start:"", end:""};
  const f = (h, mi) => h == null ? "" : pad(Math.min(23, Number(h))) + ":" + (mi || "00");
  return {start:f(m[1], m[2]), end:f(m[3], m[4])};
}
const hasWord = (low, w) => new RegExp("(^|[^a-zåäöé])" + w.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^a-zåäöé])").test(low);
function guessCal(text){
  const low = text.toLowerCase();
  const kidsNamed = S.children.filter(c => hasWord(low, c.name)).map(c => c.name);
  const friendNames = [...new Set(S.children.flatMap(c => (c.friends||[]).map(f => f.name)))].filter(n => !S.children.some(c => c.name.toLowerCase() === n.toLowerCase()));
  let friend = friendNames.find(n => hasWord(low, n)) || null;
  if (!friend) { const m = text.match(/(?:leka|lek|leker|leke|lege|leger|play|plays|playing|hos|med|with|at)\s+(?:hos\s+|med\s+|with\s+)?([A-ZÅÄÖÆØ][a-zåäöæøé]+)/); if (m && !S.children.some(c => c.name.toLowerCase() === m[1].toLowerCase())) friend = m[1]; }
  const tm = parseSvTime(text);
  return {kind: /lek|leka|leker|leke|lege|leger|play/.test(low) ? "lek" : /träning|trening|træning|practice|training|match|simskola|svømme|swim|lektion|kurs|cup/.test(low) ? "aktivitet" : /tandläkare|tannlege|tandlæge|dentist|läkare|lege|læge|doctor|bvc|vaccin/.test(low) ? "annat" : "annat",
    children: kidsNamed, friend, where: /(^|\s)(hos|at)\s/.test(low) ? "hos" : "med", date: parseSvDate(text), start: tm.start, end: tm.end, title: null};
}
async function runCalCommand(text){
  const setMsg = html => { S.calMsg = html; const el = $("#cal-status"); if (el) { el.hidden = !html; el.innerHTML = html; } };
  setMsg(`<div class="ai"><span class="spin"></span><span>${S.sample ? "Läser in…" : "Lägger in…"}</span></div>`);
  let r = null;
  if (S.sample) {
    const t = new Date();
    const prompt = `Du hjälper föräldrar att lägga in saker i barnens gemensamma kalender. Texten kan vara på svenska, norska, danska eller engelska; skriv rubriker på samma språk som texten. Idag är det ${t.toLocaleDateString("sv-SE",{weekday:"long"})} ${ymd(t)}.
Barnen heter: ${JSON.stringify(S.children.map(c=>c.name))}.
Tolka texten och svara med ENDAST JSON:
{"title": "kort rubrik, eller null om det är en lek med kompis", "kind": "lek" | "aktivitet" | "skola" | "hamtning" | "annat", "children": [barnens namn ur listan som nämns], "friend": "kompisens förnamn om barnet ska leka med eller hos en kompis, annars null", "where": "hos" om barnet ska vara hemma hos kompisen, annars "med", "date": "YYYY-MM-DD eller null", "start": "HH:MM eller null", "end": "HH:MM eller null"}
Räkna ut datum från ord som "i morgon", "på fredag" eller "15 oktober". Om året inte står: närmaste kommande.
Text: """${text}"""`;
    try { r = await S.sample.json(prompt, {modelTier:"quick"}); } catch(e) { r = null; }
  }
  const g = guessCal(text);
  if (!r || typeof r !== "object") r = g;
  const date = /^\d{4}-\d{2}-\d{2}$/.test(r.date||"") ? r.date : g.date;
  if (!date) { setMsg(`<div class="ai"><span>!</span><span>Jag hittade inget datum. Skriv t.ex. "den 15 oktober", "i morgon" eller "på fredag".</span></div>`); return false; }
  const kids = (Array.isArray(r.children) && r.children.length ? r.children : g.children).map(n => S.children.find(c => c.name.toLowerCase() === String(n).toLowerCase())).filter(Boolean);
  const kinds = Object.keys(KINDS);
  const kind = kinds.includes(r.kind) && r.kind !== "boende" ? r.kind : g.kind;
  // look the friend up on the children's cards – first the named children, then everyone
  const fname = r.friend || g.friend;
  let match = null;
  if (fname) {
    const pool = [...kids, ...S.children.filter(c => !kids.includes(c))];
    for (const c of pool) { const f = (c.friends||[]).find(f => f.name.toLowerCase() === String(fname).toLowerCase()); if (f) { match = {c, f}; break; } }
  }
  const kidIds = kids.length ? kids.map(c=>c.id) : match ? [match.c.id] : S.children.length === 1 ? [S.children[0].id] : [];
  const tm = {start: /^\d{2}:\d{2}$/.test(r.start||"") ? r.start : g.start, end: /^\d{2}:\d{2}$/.test(r.end||"") ? r.end : g.end};
  const doc = {date, start:tm.start, end:tm.end, kind, childIds:kidIds, with:"", note:""};
  if (match) {
    doc.kind = "lek";
    doc.title = `Leker ${(r.where||g.where) === "hos" ? "hos" : "med"} ${match.f.name}`;
    doc.friend = {name:match.f.name, parent:match.f.parent||"", phone:match.f.phone||"", note:match.f.note||""};
  } else {
    doc.title = cap(text).slice(0,80);
  }
  await saveDocs("events", [doc]);
  const kidNames = kidIds.map(id => kid(id)?.name).filter(Boolean).join(" och ");
  notifyOther(`${me().label} lade in "${doc.title}"${kidNames?` för ${kidNames}`:""} ${dayLow(date)}${doc.start?` kl ${doc.start}`:""}.`);
  const when = `${dayLabel(date)}${doc.start?` kl ${doc.start}${doc.end?"–"+doc.end:""}`:""}`;
  if (match) setMsg(`<div class="ai"><span style="color:var(--good);font-weight:700">✓</span><span><b>${esc(doc.title)}</b> · ${esc(when)}${kidNames?` · ${esc(kidNames)}`:""}<br><span class="muted">${esc(match.f.name)} finns på ${esc(match.c.name)}s barnkort: ${match.f.parent?esc(match.f.parent)+" ":""}${match.f.phone?`<span class="phone">${esc(match.f.phone)}</span>`:"inget nummer"}</span></span></div>`);
  else {
    const askKid = kids[0] || S.children[0];
    setMsg(`<div class="ai"><span style="color:var(--good);font-weight:700">✓</span><span>Inlagt som text: <b>${esc(doc.title)}</b> · ${esc(when)}${fname ? `<br><span class="muted">${esc(cap(fname))} finns inte på något barnkort.</span>${askKid && canAct() ? ` <button class="btn" style="padding:4px 10px;margin-top:4px;font-size:13px" data-act="addFriendFrom" data-kid="${esc(askKid.id)}" data-n="${esc(cap(fname))}">Lägg till ${esc(cap(fname))} på ${esc(askKid.name)}s barnkort</button>` : ""}` : ""}</span></div>`);
  }
  clearTimeout(runCalCommand._t); runCalCommand._t = setTimeout(() => setMsg(""), 15000);
  return true;
}

/* ---------- quick add from the home screen ---------- */
function guessActions(text){
  const low = text.toLowerCase();
  const kidN = allKidNames().find(n => new RegExp("(^|[^a-zåäöé])" + n.toLowerCase() + "($|[^a-zåäöé])").test(low)) || null;
  let body = text.replace(/^(lägg till|lägga till|lägg in|skriv upp|kom ihåg att|påminn mig om att|legg til|husk å|tilføj|husk at|add|remember to)\s+/i, "")
                 .replace(/\s+(på|i|till|til|to|on)\s+(the\s+)?(inköpslistan|handlingslistan|listan|handlelisten|indkøbslisten|listen|shopping list|grocery list|list)\.?$/i, "");
  const stripKid = t => kidN ? t.replace(new RegExp("\\s+(till|åt|för|til|for)\\s+" + kidN + "\\s*$", "i"), "") : t;
  const BUY = /^(köpa?|kjøpe|købe|buy)\s+/i;
  if (/inköpslist|handlingslist|handleliste|indkøbsliste|shopping ?list|grocery ?list/i.test(text))
    return body.split(/,|\s+(?:och|og|and)\s+/).map(t => t.trim()).filter(Boolean).map(t => ({type:"shop", text:cap(stripKid(t.replace(BUY,""))), child:kidN, group: kidN ? "ovrigt" : "mat"}));
  if (BUY.test(body)) return [{type:"shop", text:cap(stripKid(body.replace(BUY,""))), child:kidN, group:"ovrigt"}];
  const date = parseSvDate(text), tm = parseSvTime(text);
  const clean = body
    .replace(/\s*(?:kl\.?|klockan)\s*\d{1,2}(?:[:.]\d{2})?(?:\s*(?:-|–|till)\s*\d{1,2}(?:[:.]\d{2})?)?/gi, "")
    .replace(/\s*(?:på\s+|nu\s+på\s+)?(?:i\s?övermorgon|i\s?morgon|idag|i dag|ikväll|i kväll)(?=$|[^a-zåäö])/gi, "")
    .replace(/\s*(?:på\s+|nu\s+på\s+)?(?:måndag|tisdag|onsdag|torsdag|fredag|lördag|söndag)(?:en)?(?=$|[^a-zåäö])/gi, "")
    .replace(/\s*(?:den\s*)?\d{1,2}\s*(?::e|e)?\s*(?:jan|feb|mar|apr|maj|jun|jul|aug|sep|okt|nov|dec)[a-zåäö]*/gi, "")
    .replace(/\s*(?:den\s*)?\d{1,2}\/\d{1,2}/g, "")
    .replace(/\s*(?:i|till|til|in|to)\s+(?:min\s+|my\s+|the\s+)?(?:kalendern?|kalenderen|calendar)(?=$|[^a-zåäö])/gi, "")
    .replace(/\s*(?:at|klokken|klokka)\s*\d{1,2}(?:[:.]\d{2})?(?:\s*(?:-|–|to|til)\s*\d{1,2}(?:[:.]\d{2})?)?/gi, "")
    .replace(/\s*(?:on\s+|på\s+)?(?:mandag|tirsdag|lørdag|søndag|monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|today|i morgen|i dag)(?=$|[^a-zåäöæø])/gi, "")
    .replace(/\s{2,}/g, " ").trim() || body;
  // a time, or an explicit "i kalendern", means it belongs in the calendar; otherwise it is a task (with a due date if one was given)
  if (tm.start || /kalender|calendar/i.test(text)) return [{type:"event", title:cap(clean), date: date || ymd(new Date()), start:tm.start, end:tm.end}];
  return [{type:"todo", text:cap(clean), child:kidN, due:date}];
}
async function runCommand(text){
  const t = new Date();
  const setMsg = html => { S.cmdMsg = html; const el = $("#cmd-status"); if (el) { el.hidden = !html; el.innerHTML = html; } };
  setMsg(`<div class="ai"><span class="spin"></span><span>${S.sample ? "Förstår vad du menar…" : "Lägger till…"}</span></div>`);
  let actions = null;
  if (S.sample) {
    const prompt = `Du hjälper en förälder att lägga in saker i sin app. Texten kan vara på svenska, norska, danska eller engelska; behåll språket i de texter du returnerar. Idag är det ${t.toLocaleDateString("sv-SE",{weekday:"long"})} ${ymd(t)}. Förälderns barn heter: ${JSON.stringify(allKidNames())}.
Tolka texten nedan och svara med ENDAST JSON: {"actions":[...]} där varje action är en av:
{"type":"shop","text":"varan, kort, stor första bokstav","child":"barnets namn eller null","group":"mat" för mat och hushållsvaror, annars "ovrigt"}
{"type":"todo","text":"uppgiften, kort och tydlig","child":"barnets namn eller null","due":"YYYY-MM-DD eller null"}
{"type":"event","title":"kort titel","date":"YYYY-MM-DD","start":"HH:MM eller null","end":"HH:MM eller null"}
Regler: Flera varor blir flera shop. Allt som ska köpas (även kläder och presenter) är shop. Uppgifter utan köp är todo. Bara när personen ska vara någonstans vid en viss tid blir det event. "child" måste vara exakt ett namn ur listan, annars null. Räkna ut datum från ord som "i morgon" eller "på fredag".
Text: """${text}"""`;
    try { const r = await S.sample.json(prompt, {modelTier:"quick"}); if (Array.isArray(r?.actions) && r.actions.length) actions = r.actions; } catch(e) {}
  }
  if (!actions) actions = guessActions(text);
  const docs = [], done = [];
  for (const a of actions.slice(0,20)) {
    const child = kidByName(a.child)?.name || "";
    if (a.type === "event" && a.title && /^\d{4}-\d{2}-\d{2}$/.test(a.date||"")) {
      docs.push({kind:"event", title:cap(a.title).slice(0,80), date:a.date, start:a.start||"", end:a.end||"", note:""});
      done.push(`${esc(cap(a.title))} i din kalender ${dayLow(a.date)}`);
    } else if (a.text) {
      const isShop = a.type === "shop";
      docs.push({kind:isShop?"shop":"todo", text:cap(a.text).slice(0,80), childName:child, group:isShop?(a.group==="mat"?"mat":"ovrigt"):"", due:!isShop && /^\d{4}-\d{2}-\d{2}$/.test(a.due||"") ? a.due : "", done:false});
      done.push(`${esc(cap(a.text))}${child?` (${esc(child)})`:""} ${isShop?(shopShared()?"på er gemensamma inköpslista":"på inköpslistan"):`i Att göra${/^\d{4}-\d{2}-\d{2}$/.test(a.due||"")?` till ${dayLow(a.due)}`:""}`}`);
    }
  }
  if (!docs.length) { setMsg(`<div class="ai"><span>!</span><span>Jag förstod inte vad som skulle läggas till. Prova t.ex. "mjölk på inköpslistan".</span></div>`); return; }
  const sharedShopDocs = shopShared() ? docs.filter(d => d.kind === "shop").map(({kind, due, ...rest}) => rest) : [];
  if (sharedShopDocs.length) { for (let i = docs.length - 1; i >= 0; i--) if (docs[i].kind === "shop") docs.splice(i, 1); }
  setMsg(`<div class="ai"><span style="color:var(--good);font-weight:700">✓</span><span>Lagt till: ${done.join(", ")}. <button class="btn" style="padding:4px 10px;margin-left:4px;font-size:13px" data-act="${docs.length && docs.every(d=>d.kind==="event") ? "goMyCal" : "goLists"}">${docs.length && docs.every(d=>d.kind==="event") ? "Visa kalendern" : "Visa listor"}</button></span></div>`);
  if (sharedShopDocs.length) await saveDocs("shop", sharedShopDocs);
  if (docs.length) await saveDocs("my", docs);
  clearTimeout(runCommand._t); runCommand._t = setTimeout(() => setMsg(""), 10000);
}
function myKidsSheet(){
  const kids = myKids(), missing = S.children.filter(c => !kids.some(k => k.name.toLowerCase() === c.name.toLowerCase()));
  openSheet(`${sheetHead("Mina barn", "Används i dina listor och din budget. Bara du ser dem.")}
   <div class="stack"><div class="list">${kids.length ? kids.map(c=>`<div class="item"><span class="dot" style="background:${kidColor(c)};width:14px;height:14px"></span><div class="main"><div class="t">${esc(c.name)}</div></div><button class="xbtn" data-act="delKid" data-id="${esc(c.id)}" aria-label="Ta bort ${esc(c.name)}">${IC.x}</button></div>`).join("") : `<div class="empty">Inga barn tillagda.</div>`}
     <form class="addrow" data-form="myKid"><input id="mykid-name" name="name" maxlength="30" placeholder="Barnets namn" aria-label="Barnets namn" autocomplete="off"><button class="btn primary" type="submit">Lägg till</button></form></div>
   ${missing.length ? `<button class="btn block" data-act="importKids">Hämta ${missing.map(c=>esc(c.name)).join(" och ")} från ${H().space || "det gemensamma"}</button>` : ""}</div>`, "mine");
}

/* ---------- persistence ---------- */
function sharedDB(){ return S.space === "hem" && S.dbHem ? S.dbHem : S.db; }
function collRef(name){ return name === "my" ? S.db.collection("data/users/"+S.uid) : sharedDB().collection(name); }
function localList(name){ return {handover:S.handover, chores:S.chores, swaps:S.swaps, pack:S.pack, shop:S.sharedShop, events:S.events, expenses:S.expenses, payments:S.payments, children:S.children, my:S.my, notices:S.notices}[name]; }
async function saveDocs(coll, docs, id){
  const stamp = d => ({...d, createdAt:d.createdAt||Date.now(), createdBy:S.uid});
  if (S.mode === "demo" || (S.space === "hem" && !S.dbHem)) {
    if (coll === "parents") { S.parents[S.uid] = docs[0]; render(); return; }
    if (coll === "schedule") { S.schedule = {...(S.schedule||{}), ...docs[0]}; render(); return; }
    const list = localList(coll);
    if (id) { const i = list.findIndex(x=>x.id===id); if (i>=0) list[i] = {...list[i], ...docs[0], id, updatedAt:Date.now()}; else list.push({...docs[0], id}); }
    else docs.forEach(d => list.push({...stamp(d), id:uidGen()}));
    render(); return;
  }
  try {
    if (id) { const ref = collRef(coll).doc(id); const old = await ref.get(); await ref.set({...(old.exists?old.data():{}), ...docs[0], updatedAt:Date.now()}); }
    else for (const d of docs) await collRef(coll).add(stamp(d));
  } catch(e) { dbError(e); }
}
async function removeDoc(coll, id){
  const item = (localList(coll)||[]).find(x=>x.id===id);
  if (item?.imgId && S.mode !== "demo") imgRef(coll === "expenses" ? "shared" : "mine", item.imgId).delete().catch(()=>{});
  if (S.mode === "demo" && coll === "schedule") { S.schedule = null; render(); return; }
  if (S.mode === "demo" || (S.space === "hem" && !S.dbHem)) { const l = localList(coll); const i = l.findIndex(x=>x.id===id); if (i>=0) l.splice(i,1); render(); return; }
  try { await collRef(coll).doc(id).delete(); } catch(e) { dbError(e); }
}
function notifyOther(text){
  for (const to of otherIds()) {
    if (S.mode === "demo" || (S.space === "hem" && !S.dbHem)) continue;
    collRef("notices").add({to, from:S.uid, text, read:false, createdAt:Date.now()}).catch(()=>{});
  }
}
function dbError(e){
  if (e?.code === "invalid_argument" && !S.canWrite) return;
  if (e?.code === "invalid_argument") { S.canWrite = false; render(); toast("Du saknar behörighet att spara"); return; }
  toast(e?.code === "quota_exceeded" ? "Lagringen är full – ta bort gamla poster" : "Kunde inte spara. Försök igen.");
}

/* ---------- events ---------- */
document.addEventListener("click", ev => {
  const t = ev.target.closest("[data-act]"); if (!t) return;
  const a = t.dataset.act;
  if (["goLists","goMyCal","goPack","goChores"].includes(a)) exitHem();
  if (a === "closeScrim") { if (ev.target === t) closeSheet(); return; }
  switch (a) {
    case "go": exitHem(); S.view = t.dataset.v; remember(); render(); window.scrollTo(0,0); break;
    case "goHem": enterHem().then(() => { render(); window.scrollTo(0,0); }); break;
    case "invite": inviteSheet(); break;
    case "logout": window.Vardagen?.signOut(); break;
    case "login": location.reload(); break;
    case "copyLink": { const v = t.dataset.t; try { navigator.clipboard.writeText(v).then(()=>toast("Länken är kopierad"), ()=>toast(v)); } catch(e) { toast(v); } break; }
    case "shareLink": { const v = t.dataset.t; if (navigator.share) navigator.share({title:"Vardagen", text:t.dataset.msg, url:v}).catch(()=>{}); break; }
    case "tab": S.tab[S.view === "home" ? "shared" : S.view] = t.dataset.t; remember(); render(); window.scrollTo(0,0); break;
    case "close": closeSheet(); break;
    case "notices": noticesSheet(); break;
    case "selDay": S.selDay[t.dataset.scope] = t.dataset.d; render(); break;
    case "calNav": { const s = t.dataset.scope, m = S.calMonth[s]; S.calMonth[s] = new Date(m.getFullYear(), m.getMonth()+Number(t.dataset.n), 1); render(); break; }
    case "kidFilter": S.kidFilter = t.dataset.id || null; render(); break;
    case "toggleShared": S.showSharedInMine = !S.showSharedInMine; render(); break;
    case "newEvent": eventSheet(t.dataset.scope); break;
    case "openEvent": if (canAct()) eventSheet(t.dataset.scope, t.dataset.id); break;
    case "scan": expenseSheet(t.dataset.scope, {scan:true}); break;
    case "manual": expenseSheet(t.dataset.scope, {}); break;
    case "openExp": expenseDetail(t.dataset.scope, t.dataset.id); break;
    case "editExp": expenseSheet(t.dataset.scope, {id:t.dataset.id}); break;
    case "pay": paySheet(); break;
    case "editKid": if (canAct()) kidSheet(t.dataset.id); break;
    case "kidCard": kidCard(t.dataset.id); break;
    case "addFriendFrom": kidCard(t.dataset.kid, t.dataset.n); setTimeout(()=>$("#fr-parent")?.focus(), 50); break;
    case "copyTxt": { const txt = t.dataset.t;
      try { navigator.clipboard.writeText(txt).then(()=>toast("Numret är kopierat"), ()=>toast(txt)); } catch(e) { toast(txt); } break; }
    case "delFriend": { const c = kid(t.dataset.kid); if (!c) break; const fr = [...(c.friends||[])]; const gone = fr.splice(Number(t.dataset.i),1)[0];
      c.friends = fr; saveDocs("children", [{friends:fr}], c.id); kidCard(c.id); toast(`${gone?.name||"Kompisen"} är borttagen`); break; }
    case "schedule": scheduleSheet(); break;
    case "schedDel": closeSheet(); removeDoc("schedule", "main").then(()=>toast("Schemat är borttaget")); break;
    case "swapReq": swapSheet(t.dataset.d); break;
    case "swapYes": answerSwap(t.dataset.id, true); break;
    case "swapNo": answerSwap(t.dataset.id, false); break;
    case "swapCancel": removeDoc("swaps", t.dataset.id).then(()=>toast("Förfrågan borttagen")); break;
    case "goPack": S.view = "shared"; S.tab.shared = "kids"; remember(); render(); setTimeout(()=>$("#pack")?.scrollIntoView({behavior:"smooth"}), 50); break;
    case "packReset": (async () => { for (const d of S.pack.filter(x=>x.done)) await saveDocs("pack", [{done:false}], d.id); toast("Packlistan är nollställd inför nästa byte"); })(); break;
    case "recurList": recurListSheet(); break;
    case "dinner": dinnerSheet(); break;
    case "dinAsk": askDinner(); break;
    case "dinAdd": addDinner(t.dataset.d === "all" ? null : Number(t.dataset.d)); break;
    case "handover": handoverSheet(t.dataset.d); break;
    case "handoverRead": saveDocs("handover", [{read:true, readAt:Date.now()}], t.dataset.id); break;
    case "lovNew": lovSheet(); break;
    case "choreDone": choreDone(t.dataset.coll, t.dataset.id); break;
    case "choreEdit": choreSheet(t.dataset.coll, t.dataset.id); break;
    case "goChores": if (choresShared()) { S.view = "shared"; S.tab.shared = "chores"; } else { S.view = "mine"; S.tab.mine = "lists"; } remember(); render(); if (!choresShared()) setTimeout(()=>$("#chores")?.scrollIntoView({behavior:"smooth"}), 50); else window.scrollTo(0,0); break;
    case "goalEdit": goalSheet(t.dataset.id); break;
    case "goalDeposit": depositSheet(t.dataset.id); break;
    case "recurEdit": recurSheet(t.dataset.id); break;
    case "editMe": if (canAct()) meSheet(false); break;
    case "editProj": projSheet(t.dataset.id); break;
    case "openProj": projDetail(t.dataset.id); break;
    case "scanProj": { const pid = t.dataset.id; expenseSheet("mine", {scan:true}); const sel = $("#ex-proj"); if (sel) sel.value = pid; const c = $("#ex-cat"); if (c) c.value = "Renovering"; break; }
    case "budgets": budgetSheet(); break;
    case "period": S.budgetPeriod = t.dataset.p; render(); break;
    case "pickMonth": S.budgetPeriod = "month"; S.budgetMonth = Number(t.dataset.m); render(); break;
    case "bNav": { const n = Number(t.dataset.n);
      if (S.budgetPeriod === "year") S.budgetYear += n;
      else { let m = S.budgetMonth + n, y = S.budgetYear; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } S.budgetMonth = m; S.budgetYear = y; }
      render(); break; }
    case "del": confirmDelete(t.dataset.coll, t.dataset.id); break;
    case "hint": { const i = document.getElementById(t.dataset.to || "cmd-in"); if (i) { i.value = t.dataset.h; i.focus(); } break; }
    case "goMyCal": S.view = "mine"; S.tab.mine = "cal"; remember(); render(); window.scrollTo(0,0); break;
    case "goLists": S.view = "mine"; S.tab.mine = "lists"; remember(); render(); window.scrollTo(0,0); break;
    case "listKid": S.listKid = t.dataset.n || null; render(); break;
    case "toggleItem": { const co = t.dataset.coll || "my", d = localList(co).find(x=>x.id===t.dataset.id); if (d) saveDocs(co, [{done:!d.done}], d.id); break; }
    case "delItem": removeDoc(t.dataset.coll || "my", t.dataset.id); break;
    case "clearDone": (async () => { const list = t.dataset.kind === "shop" ? shopItems() : myTodos().map(d=>({...d,_coll:"my"}));
      for (const d of list.filter(x=>x.done)) await removeDoc(d._coll, d.id); toast("Avbockade rader borttagna"); })(); break;
    case "setup": setupSheet(false); break;
    case "archScope": S.archScope = t.dataset.s; render(); break;
    case "myKids": myKidsSheet(); break;
    case "delKid": removeDoc("my", t.dataset.id).then(myKidsSheet); break;
    case "importKids": (async () => { const have = myKids().map(k=>k.name.toLowerCase());
      await saveDocs("my", S.children.filter(c=>!have.includes(c.name.toLowerCase())).map(c=>({kind:"child", name:c.name, color:c.color??0}))); myKidsSheet(); })(); break;
    case "dlReceipt": downloadReceipt(t.dataset.scope, t.dataset.id); break;
  }
});
document.addEventListener("submit", async ev => {
  const f = ev.target, kind = f.dataset?.form; if (!kind) return;
  ev.preventDefault();
  if (kind === "cmd") { const q = f.q.value.trim(); if (!q) return; f.q.value = ""; countHint(); await runCommand(q); }
  else if (kind === "calcmd") { const q = f.q.value.trim(); if (!q) return; f.q.value = ""; const ok = await runCalCommand(q); if (!ok) { const i = $("#cal-in"); if (i) { i.value = q; i.focus(); } } }
  else if (kind === "add") {
    const text = f.text.value.trim(); if (!text) return;
    const k = f.dataset.kind; f.text.value = ""; S.refocus = "add-" + k;
    if (k === "pack") await saveDocs("pack", [{text:cap(text), done:false}]);
    else if (k === "shop" && shopShared()) await saveDocs("shop", [{text:cap(text), childName:S.listKid||"", group:"", done:false}]);
    else await saveDocs("my", [{kind:k, text:cap(text), childName:S.listKid||"", group:"", due:k==="todo"?(f.due?.value||""):"", done:false}]);
  } else if (kind === "friend") {
    const c = kid(f.dataset.kid); if (!c) return;
    const fr = {name:cap(f.name.value).slice(0,30), parent:f.parent.value.trim(), phone:f.phone.value.trim(), note:f.note.value.trim()};
    if (!fr.name) return;
    c.friends = [...(c.friends||[]), fr];
    kidCard(c.id);
    await saveDocs("children", [{friends:c.friends, updatedBy:S.uid}], c.id);
    notifyOther(`${me().label} lade till ${fr.name} som kompis på ${c.name}s barnkort.`);
    toast(`${fr.name} är tillagd`);
  } else if (kind === "myKid") {
    const name = cap(f.name.value).slice(0,30); if (!name) return;
    const used = myKids().map(c=>c.color);
    await saveDocs("my", [{kind:"child", name, color:KID_COLORS.map((_,i)=>i).find(i=>!used.includes(i)) ?? myKids().length%KID_COLORS.length}]); myKidsSheet();
  }
});
document.addEventListener("input", ev => {
  if (ev.target.id === "arch-q") { S.archQ = ev.target.value; const r = $("#arch-results"); if (r) r.innerHTML = archiveList(); }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

/* ---------- boot ---------- */
loadDemo(); render(); trNode(document.body);
(async () => {
  const [db, user] = await Promise.all([window.claude?.use?.("db") ?? null, window.claude?.use?.("user") ?? null]);
  S.ready = true;
  const uid = user ? await user.id() : null;
  if (!db || !uid) { render(); return; }
  S.db = db; S.uid = uid; S.mode = "live"; S.hemData = null; S.kidsDays = null;
  S.parents = {}; S.children = []; S.sharedShop = []; S.schedule = null; S.swaps = []; S.pack = []; S.handover = []; S.chores = []; S.events = []; S.expenses = []; S.payments = []; S.notices = []; S.my = [];
  const can = await user.can("data.write").catch(()=>null); S.canWrite = can !== false;
  render();
  const docs = snap => snap.docs.map(d => ({id:d.id, ...d.data()}));
  let gotParents = false, gotMy = false, onboarded = false;
  const maybeOnboard = () => {
    if (onboarded || !gotParents || !gotMy || !S.canWrite) return; onboarded = true;
    if (!settings().household) setupSheet(true);
    else if (H().shared && !S.parents[S.uid]) meSheet(true);
  };
  const onErr = e => { if (e?.code === "revoked") { S.canWrite = false; render(); } };
  db.collection("parents").onSnapshot(s => { const v = Object.fromEntries(s.docs.map(d=>[d.id, d.data()]));
    if (S.space === "hem") S.stash.parents = v; else S.parents = v;
    if (!gotParents && !s.metadata.fromCache) { gotParents = true; maybeOnboard(); }
    render(); }, onErr);
  db.collection("children").onSnapshot(s => { S.children = docs(s).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0)); render(); }, onErr);
  db.collection("events").onSnapshot(s => put("events", docs(s)), onErr);
  db.collection("expenses").onSnapshot(s => put("expenses", docs(s)), onErr);
  db.collection("payments").onSnapshot(s => put("payments", docs(s)), onErr);
  db.collection("notices").where("to","==",uid).onSnapshot(s => put("notices", docs(s)), onErr);
  db.collection("data/users/"+uid).onSnapshot(s => { S.my = docs(s);
    if (!gotMy && !s.metadata.fromCache) { gotMy = true; const l = settings().lang; if (l && l !== LANG) setLang(l, false); maybeOnboard(); }
    render(); }, onErr);
  db.collection("shop").onSnapshot(s => put("sharedShop", docs(s)), onErr);
  db.doc("schedule/main").onSnapshot(d => { S.schedule = d.exists ? d.data() : null; render(); }, onErr);
  db.collection("swaps").onSnapshot(s => put("swaps", docs(s)), onErr);
  db.collection("pack").onSnapshot(s => put("pack", docs(s)), onErr);
  db.collection("handover").onSnapshot(s => put("handover", docs(s)), onErr);
  db.collection("chores").onSnapshot(s => put("chores", docs(s)), onErr);
  db.doc("kidsdays/main").onSnapshot(d => { S.kidsDays = d.exists && d.data().owner !== uid ? d.data().days || [] : null; render(); }, onErr);
  if (window.Vardagen?.ctx?.dbHem) subscribeHem(window.Vardagen.ctx.dbHem);
  setInterval(syncKidsDays, 15000); setTimeout(syncKidsDays, 4000);
  window.claude.use("sample").then(async s => { if (!s) return; S.sample = s; const l = await s.limits().catch(()=>null); S.canImages = !!l?.images; });
  window.claude.use("downloads").then(d => { S.downloads = d; });
})();
})();
