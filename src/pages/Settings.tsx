
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSMS, setNotificationsSMS] = useState(true);
  const [notificationsApp, setNotificationsApp] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSaveNotifications = () => {
    toast({
      title: "Notification settings updated",
    });
  };
  
  const handleSaveSecurity = () => {
    if (twoFactorEnabled) {
      toast({
        title: "Two-factor authentication enabled",
        description: "You will now receive a code via SMS when logging in",
      });
    } else {
      toast({
        title: "Two-factor authentication disabled",
      });
    }
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword) {
      toast({
        variant: "destructive",
        title: "Current password required",
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Password too short",
        description: "New password must be at least 8 characters long",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "New password and confirmation must match",
      });
      return;
    }
    
    // In a real app, this would call an API to change the password
    toast({
      title: "Password changed successfully",
    });
    
    // Reset fields
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Username</dt>
                <dd className="text-lg">{currentUser?.username}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Account Number</dt>
                <dd className="text-lg">XXXX-XXXX-{currentUser?.id || "0000"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Account Type</dt>
                <dd className="text-lg">Savings</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch 
                  id="email-notifications"
                  checked={notificationsEmail}
                  onCheckedChange={setNotificationsEmail}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch 
                  id="sms-notifications"
                  checked={notificationsSMS}
                  onCheckedChange={setNotificationsSMS}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="app-notifications">App Notifications</Label>
                <Switch 
                  id="app-notifications"
                  checked={notificationsApp}
                  onCheckedChange={setNotificationsApp}
                />
              </div>
              
              <Button size="sm" onClick={handleSaveNotifications}>Save Preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require a verification code when logging in</p>
                </div>
                <Switch 
                  id="two-factor"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                />
              </div>
              
              <Button size="sm" onClick={handleSaveSecurity}>Save Security Settings</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password" 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
