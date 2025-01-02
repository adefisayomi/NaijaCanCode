import { useEffect, useState } from "react";




const EditingTab = () => {
    const [isDocumentReady, setIsDocumentReady] = useState(false);
    const [htmlCode, setHtmlCode] = useState("<-- Write your Html code here! -->");
    const [cssCode, setCssCode] = useState("// Write your css code here");
    const [jsCode, setJsCode] = useState("// Write your Javascript code here");
  
    useEffect(() => {
      if (document.readyState === "complete") {
        setIsDocumentReady(true);
      } else {
        const handleDocumentReady = () => setIsDocumentReady(true);
        window.addEventListener("load", handleDocumentReady);
  
        return () => {
          window.removeEventListener("load", handleDocumentReady);
        };
      }
    }, []);
  
    const renderCode = () => {
      const iframe = document.getElementById("output-frame") as HTMLIFrameElement;
      if (iframe) {
        const documentContent = `
          <html>
            <head>
              <style>${cssCode}</style>
            </head>
            <body>
              ${htmlCode}
              <script>
                ${jsCode}
              </script>
            </body>
          </html>
        `;
        iframe.srcdoc = documentContent;
      }
    };
  
    // Automatically render code when htmlCode, cssCode, or jsCode changes
    useEffect(() => {
      renderCode();
    }, [htmlCode, cssCode, jsCode]);
  
    if (!isDocumentReady) {
      return <div>Loading editor...</div>;
    }
  
    return (
      <ResizablePanelGroup
          direction="horizontal"
          className="w-full flex-grow px-8"
      >
  
        <ResizablePanel defaultSize={50}>
          <Tabs defaultValue="html" className="w-full h-full">
  
              <TabsList className="grid grid-cols-3 gap-3 rounded-none">
                  <TabsTrigger className="" value="html">HTML</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="js">JS</TabsTrigger>
              </TabsList>
  
              <TabsContent value="html" className="h-full">
                  <Editor
                      language="html"
                      value={htmlCode}
                      onChange={(value) => setHtmlCode(value || "")}
                      className="h-full"
                  />
              </TabsContent>
  
              <TabsContent value="css" className="h-full">
                  <Editor
                      className="h-full"
                      language="css"
                      value={cssCode}
                      onChange={(value) => setCssCode(value || "")}
                  />
              </TabsContent>
  
              <TabsContent value="js" className="h-full">
                  <Editor
                      className="h-full"
                      language="javascript"
                      value={jsCode}
                      onChange={(value) => setJsCode(value || "")}
                  />
              </TabsContent>
          </Tabs>
  
        </ResizablePanel>
  
        <ResizableHandle />
        
        <ResizablePanel defaultSize={50} className="flex items-center justify-center">
          <iframe
            id="output-frame"
            title="preview"
            className="w-full h-full"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  };
   