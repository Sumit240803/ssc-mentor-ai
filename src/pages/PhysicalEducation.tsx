import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PhysicalEducation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              दिल्ली पुलिस कांस्टेबल शारीरिक परीक्षा के लिए दैनिक शेड्यूल
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            यह शेड्यूल सुनिश्चित करता है कि आपके पास सुबह की कसरत और शाम की दौड़ दोनों के लिए पर्याप्त समय हो।
          </p>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6 border-primary/50 bg-primary/5">
          <Info className="h-4 w-4" />
          <AlertTitle>Important Information</AlertTitle>
          <AlertDescription>
            This document contains all the essential information about the physical exam requirements for Delhi Police. 
            Please read carefully and prepare accordingly.
          </AlertDescription>
        </Alert>

        {/* Morning Session */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              ☀️ सुबह का सत्र: शक्ति और लचीलापन (6:30 AM - 7:30 AM)
            </h2>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>समय</TableHead>
                    <TableHead>गतिविधि</TableHead>
                    <TableHead>अवधि</TableHead>
                    <TableHead>विवरण</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">6:30 - 6:40 AM</TableCell>
                    <TableCell>गतिशील वार्म-अप</TableCell>
                    <TableCell>10 मिनट</TableCell>
                    <TableCell>हल्के कार्डियो, लेग स्विंग्स, आर्म सर्कल।</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6:40 - 7:15 AM</TableCell>
                    <TableCell>शक्ति प्रशिक्षण</TableCell>
                    <TableCell>35 मिनट</TableCell>
                    <TableCell>पैरों और कोर पर ध्यान केंद्रित करें।</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">7:15 - 7:30 AM</TableCell>
                    <TableCell>योग/स्ट्रेचिंग</TableCell>
                    <TableCell>15 मिनट</TableCell>
                    <TableCell>मांसपेशियों की रिकवरी के लिए।</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 bg-muted/50 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3">🏋️‍♂️ सुबह की शक्ति प्रशिक्षण (उदाहरण)</h3>
              <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                <li>स्क्वैट्स – जांघों और ग्लूट्स की ताकत</li>
                <li>वॉकिंग लंग्स – संतुलन और गतिशीलता</li>
                <li>पुश-अप्स – ऊपरी शरीर और कोर की मजबूती</li>
                <li>प्लैंक – कोर स्थिरता के लिए</li>
                <li>काल्फ रेज़ – निचले पैर की मजबूती</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Evening Session */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              🌙 शाम का सत्र: दौड़ और सहनशक्ति (5:00 PM - 7:00 PM)
            </h2>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>समय</TableHead>
                    <TableHead>गतिविधि</TableHead>
                    <TableHead>अवधि</TableHead>
                    <TableHead>विवरण</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">5:00 - 5:15 PM</TableCell>
                    <TableCell>वार्म-अप</TableCell>
                    <TableCell>15 मिनट</TableCell>
                    <TableCell>धीमी जॉगिंग और स्ट्रेचिंग।</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">5:15 - 6:15 PM</TableCell>
                    <TableCell>मुख्य दौड़ कसरत</TableCell>
                    <TableCell>60 मिनट</TableCell>
                    <TableCell>इंटरवल, टैम्पो, या लंबी दौड़ का अभ्यास।</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6:15 - 6:45 PM</TableCell>
                    <TableCell>लंबी/ऊंची कूद तकनीक</TableCell>
                    <TableCell>30 मिनट</TableCell>
                    <TableCell>टेक-ऑफ तकनीक पर अभ्यास।</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">6:45 - 7:00 PM</TableCell>
                    <TableCell>आराम</TableCell>
                    <TableCell>15 मिनट</TableCell>
                    <TableCell>रिकवरी और तैयारी।</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Training Cycle */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">🗓️ 6-सप्ताह का शाम का साप्ताहिक प्रशिक्षण चक्र</h2>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>दिन</TableHead>
                    <TableHead>मुख्य कसरत</TableHead>
                    <TableHead>लक्ष्य</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">सोमवार</TableCell>
                    <TableCell>इंटरवल ट्रेनिंग (गति)</TableCell>
                    <TableCell>400 मीटर × 6–8 बार तेज़ दौड़</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">मंगलवार</TableCell>
                    <TableCell>लंबी/ऊंची कूद तकनीक</TableCell>
                    <TableCell>टेक-ऑफ तकनीक पर अभ्यास</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">बुधवार</TableCell>
                    <TableCell>क्रॉस ट्रेनिंग / रिकवरी</TableCell>
                    <TableCell>स्विमिंग, साइकिलिंग, हल्के व्यायाम</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">गुरुवार</TableCell>
                    <TableCell>टैम्पो रन</TableCell>
                    <TableCell>20 मिनट तेज़ लेकिन आरामदायक गति</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">शुक्रवार</TableCell>
                    <TableCell>जंपिंग और स्प्रिंट्स</TableCell>
                    <TableCell>10 कूद + 6 × 100m स्प्रिंट</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">शनिवार</TableCell>
                    <TableCell>लंबी/आसान दौड़</TableCell>
                    <TableCell>4–5 किमी धीमी जॉगिंग या टाइम ट्रायल</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">रविवार</TableCell>
                    <TableCell>पूर्ण आराम</TableCell>
                    <TableCell>रिकवरी</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Alert className="mt-6 border-primary/50 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription>
                याद रखें, अपनी कसरत की तीव्रता को धीरे-धीरे बढ़ाना आवश्यक है ताकि चोट से बचा जा सके।
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Additional Info Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Physical Standards</h3>
                <p className="text-sm text-muted-foreground">
                  Height, chest, and weight requirements as per Delhi Police guidelines
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Endurance Tests</h3>
                <p className="text-sm text-muted-foreground">
                  Running events and time requirements for qualification
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Medical Fitness</h3>
                <p className="text-sm text-muted-foreground">
                  Medical examination criteria and health standards
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PhysicalEducation;
