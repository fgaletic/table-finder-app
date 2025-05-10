import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, User, Dices } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  const handleSave = () => {
    toast.success("Preferences saved!");
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">My Profile</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <aside className="w-full md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-20 h-20 mx-auto">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-2">Guest User</CardTitle>
              <p className="text-sm text-muted-foreground">Joined May 2025</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Tables visited</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Reviews</span>
                <span className="font-medium">1</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Rating</span>
                <div className="flex items-center">
                  <span className="font-medium mr-1">4.5</span>
                  <span className="text-yellow-500">★</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </aside>

        <main className="w-full md:w-2/3">
          <Tabs defaultValue="activity">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="activity">My Activity</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Visited Tables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                      <Dices className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Library Lounge Dices</h3>
                        <p className="text-xs text-muted-foreground">Visited yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
                      <Dices className="h-8 w-8 text-primary" />
                      <div>
                        <h3 className="font-medium">Comfy Corner Table</h3>
                        <p className="text-xs text-muted-foreground">Visited last week</p>
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <Button variant="link" asChild>
                        <Link to="/">Find more tables</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Table Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Must-have amenities</label>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <Badge className="rounded-full px-3 py-1 bg-primary/10 text-primary border-primary/30">WiFi</Badge>
                        <Badge className="rounded-full px-3 py-1 bg-primary/10 text-primary border-primary/30">Power Outlet</Badge>
                        <Badge className="rounded-full px-3 py-1 bg-secondary/10 text-secondary-foreground border-secondary/30">Quiet</Badge>
                        <Button variant="outline" size="sm" className="text-xs h-6 rounded-full">
                          + Add
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button onClick={handleSave}>Save Preferences</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
