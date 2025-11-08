import { Card } from "@/components/ui/card";
import { Dumbbell, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PhysicalEducation = () => {
  // Convert edit link to embed link
  const embedUrl = "https://docs.google.com/document/d/1s3QmftmklReDNdx_mbBSXz8FkHRoMGB2byn7zXjJMig/preview";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Dumbbell className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Physical Education
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Complete guide to Delhi Police Physical Examination requirements and preparation
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

        {/* Google Docs Embed Card */}
        <Card className="p-0 overflow-hidden border-2 shadow-xl">
          <div className="relative w-full" style={{ height: 'calc(100vh - 250px)', minHeight: '600px' }}>
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              title="Physical Education - Delhi Police Exam Guide"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </Card>

        {/* Additional Info Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Dumbbell className="h-5 w-5 text-blue-500" />
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
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Dumbbell className="h-5 w-5 text-green-500" />
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
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Dumbbell className="h-5 w-5 text-purple-500" />
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
