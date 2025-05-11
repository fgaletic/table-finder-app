
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchGamingTableWithHost, createBooking, sendMessage } from "@/services/supabaseService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Star, Dices, Send, Mail } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

// Contact form component
const ContactForm = ({ hostId, tableId }: { hostId: string; tableId: string }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill out all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendMessage({
        sender_name: name,
        sender_email: email,
        host_id: hostId,
        table_id: tableId,
        message,
      });

      toast.success("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">Your Email</label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
        <Textarea 
          id="message" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I'm interested in this gaming table and have a few questions..."
          rows={4}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
};

// Booking form component
const BookingForm = ({ tableId }: { tableId: string }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !date || !startTime || !endTime) {
      toast.error("Please fill out all booking fields");
      return;
    }

    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error("End time must be after start time");
      return;
    }

    setIsBooking(true);
    try {
      await createBooking({
        table_id: tableId,
        user_name: name,
        user_email: email,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        status: "pending"
      });

      toast.success("Booking request submitted successfully!");
      setName("");
      setEmail("");
      setDate("");
      setStartTime("");
      setEndTime("");
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
      console.error(error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="bookingName" className="block text-sm font-medium mb-1">Your Name</label>
        <Input id="bookingName" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
      </div>
      <div>
        <label htmlFor="bookingEmail" className="block text-sm font-medium mb-1">Your Email</label>
        <Input id="bookingEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
      </div>
      <div>
        <label htmlFor="bookingDate" className="block text-sm font-medium mb-1">Date</label>
        <Input id="bookingDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={format(new Date(), "yyyy-MM-dd")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-1">Start Time</label>
          <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-1">End Time</label>
          <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isBooking}>
        <Calendar className="h-4 w-4 mr-2" />
        {isBooking ? "Submitting..." : "Request Booking"}
      </Button>
    </form>
  );
};

const GamingTableDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"contact" | "book">("contact");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['tableWithHost', id],
    queryFn: () => fetchGamingTableWithHost(id || ""),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading table details...</p>
      </div>
    );
  }
  
  if (error || !data || !data.table) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Table Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the table you're looking for.
        </p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  const { table, host } = data;

  const handleCheckAvailability = () => {
    if (table.availability.status === "available") {
      toast.success("This table is available! Hurry over before someone else takes it.");
    } else if (table.availability.status === "occupied") {
      toast.info(`This table is currently occupied until ${table.availability.until}`);
    } else {
      toast.error("This table is currently under maintenance.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{table.name}</h1>
      </div>
      
      {/* Image gallery */}
      <div className="bg-muted rounded-lg overflow-hidden h-64 flex items-center justify-center">
        {table.images && table.images.length > 0 ? (
          <img 
            src={table.images[0]} 
            alt={table.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground">
            <Dices className="h-16 w-16" />
          </div>
        )}
      </div>
      
      {/* Main info */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{table.location.address}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="ml-1 font-medium">{table.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({table.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <Badge 
                className={
                  table.availability.status === "available" 
                    ? "bg-green-500" 
                    : table.availability.status === "occupied" 
                    ? "bg-amber-500" 
                    : "bg-red-500"
                }
              >
                {table.availability.status.charAt(0).toUpperCase() + table.availability.status.slice(1)}
                {table.availability.until && ` until ${table.availability.until}`}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-muted-foreground">{table.description}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {table.amenities && table.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Host information */}
              {host && (
                <div className="pt-4 mt-4 border-t">
                  <h2 className="text-lg font-medium mb-2">Hosted by</h2>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {host.avatar_url ? (
                        <img src={host.avatar_url} alt={host.name} className="h-full w-full object-cover" />
                      ) : (
                        host.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{host.name}</div>
                      <div className="text-sm text-muted-foreground">{host.bio || "Table host"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Current Status</h3>
                <div 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-white 
                    ${table.availability.status === "available" 
                      ? "bg-green-500" 
                      : table.availability.status === "occupied" 
                      ? "bg-amber-500" 
                      : "bg-red-500"
                    }`}
                >
                  <span className="capitalize font-medium">
                    {table.availability.status}
                  </span>
                </div>
                {table.availability.until && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Until {table.availability.until}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full"
                onClick={handleCheckAvailability}
              >
                Check Availability
              </Button>

              {/* Contact/Book tabs */}
              {host && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex border-b mb-4">
                    <button
                      className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'contact' ? 'border-b-2 border-primary' : ''}`}
                      onClick={() => setActiveTab('contact')}
                    >
                      <Mail className="h-4 w-4 inline mr-1" />
                      Contact Host
                    </button>
                    <button
                      className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'book' ? 'border-b-2 border-primary' : ''}`}
                      onClick={() => setActiveTab('book')}
                    >
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Book Table
                    </button>
                  </div>

                  {activeTab === 'contact' ? (
                    <ContactForm hostId={host.id} tableId={table.id} />
                  ) : (
                    <BookingForm tableId={table.id} />
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GamingTableDetail;
