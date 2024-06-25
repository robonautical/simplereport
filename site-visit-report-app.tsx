import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { jsPDF } from "jspdf";

const SiteVisitReportApp = () => {
  const [projectName, setProjectName] = useState('');
  const [inspector, setInspector] = useState('');
  const [projectNumber, setProjectNumber] = useState('');
  const [contractor, setContractor] = useState('');
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('');
  const [activities, setActivities] = useState('');
  const [photos, setPhotos] = useState([]);

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    setPhotos([...photos, ...files]);
  };

  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Site Visit Report', 105, 15, { align: 'center' });
    
    // Add content
    doc.setFontSize(12);
    doc.text(`Project Name: ${projectName}`, 20, 30);
    doc.text(`Inspector: ${inspector}`, 20, 40);
    doc.text(`Project Number: ${projectNumber}`, 20, 50);
    doc.text(`Contractor: ${contractor}`, 20, 60);
    doc.text(`Date: ${date}`, 20, 70);
    doc.text(`Weather: ${weather}`, 20, 80);
    
    doc.text('Activities & Discussions:', 20, 100);
    const splitActivities = doc.splitTextToSize(activities, 170);
    doc.text(splitActivities, 20, 110);

    // Add photos
    let yPosition = doc.lastAutoTable.finalY || 130;
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const reader = new FileReader();
      reader.onload = function(event) {
        doc.addImage(event.target.result, 'JPEG', 20, yPosition, 80, 60);
        yPosition += 70;
        
        if (i === photos.length - 1) {
          doc.save('site_visit_report.pdf');
        }
      };
      reader.readAsDataURL(photo);
    }

    if (photos.length === 0) {
      doc.save('site_visit_report.pdf');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    generatePDF();
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Site Visit Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <Input
                placeholder="Inspector"
                value={inspector}
                onChange={(e) => setInspector(e.target.value)}
              />
              <Input
                placeholder="Project Number"
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
              />
              <Input
                placeholder="Contractor"
                value={contractor}
                onChange={(e) => setContractor(e.target.value)}
              />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                placeholder="Weather"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
              />
            </div>
            <Textarea
              placeholder="Today's Activities & Discussions"
              value={activities}
              onChange={(e) => setActivities(e.target.value)}
              rows={5}
            />
            <div>
              <Button type="button" onClick={() => document.getElementById('photo-upload').click()}>
                <Camera className="mr-2 h-4 w-4" /> Upload Photos
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <div className="mt-2">
                {photos.length} photo(s) selected
              </div>
            </div>
            <Button type="submit">Generate PDF Report</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteVisitReportApp;
