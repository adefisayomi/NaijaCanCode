import { useEffect, useState } from "react"
import { useFetcher, useLoaderData } from "@remix-run/react"
import { getCode, saveCode } from "~/.server/controllers"
import { errorMessage } from "~/src/constants"
import { ActionFunctionArgs } from "@remix-run/node"
import Layout from "~/src/layout"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "~/components/ui/tabs";
  import Editor from "@monaco-editor/react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "~/components/ui/resizable";
import { useTheme } from "remix-themes"
import DOMPurify from 'dompurify';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "~/components/ui/select"



export async function action ({request}: ActionFunctionArgs) {
    try {
        if (request.method === 'POST') {
            const formData = await request.formData()
            const {html, js, css} = Object.fromEntries(formData) as any
            const res = await saveCode({userId: '1234', codePayload: {html, css, js}})
        }
        return ({})
    }
    catch(err: any) {
        return errorMessage(err.message)
    }
}

export async function loader () {
    return await getCode('1234')
}

export default function Code () {

   
    const data = useLoaderData<typeof loader>().data.code
    const [jsType, setJsType] = useState("javascript")
    const [code, setCode] = useState(data as {js: string, html: string, css: string})
    const [activePanel, setActivePanel] = useState<keyof typeof code>("html");
    const [isDocumentReady, setIsDocumentReady] = useState(false);
    const handleSubmit = async () => fetcher.submit(code, {method: 'POST'})
    const handleSetCode = (value: string | undefined) => {
        setCode((prev) => ({
          ...prev,
          [activePanel]: value || "",
        }));
      };
    const handleChangePanel = (value: keyof typeof code) => setActivePanel(value);
    const fetcher = useFetcher()
    const [theme] = useTheme()
    const sanitizedHtml = typeof window !== 'undefined' ? DOMPurify.sanitize(data.html) : data.html;


    useEffect(() => {
        handleSubmit()
    }, [code])
    // ---------------------------------
    useEffect(() => {
        const handleDocumentReady = () => setIsDocumentReady(true);
        if (document.readyState === "complete") {
          handleDocumentReady();
        } else {
          window.addEventListener("load", handleDocumentReady);
          return () => window.removeEventListener("load", handleDocumentReady);
        }
      }, []);

    
    return (
        <Layout disableFooter>
            <div className="w-full h-lvh overflow-hidden fixed pt-16">
                <ResizablePanelGroup direction="horizontal" className=" h-full">

                    <ResizablePanel defaultSize={50} className="">
                        <Tabs
                            defaultValue="html"
                            className="w-full h-full overflow-hidden"
                            onValueChange={(value: string) => handleChangePanel(value as keyof typeof code)}
                        >
                            <TabsList className="grid grid-cols-3 gap-3 rounded-none">
                                <TabsTrigger value="html">HTML</TabsTrigger>
                                <TabsTrigger value="css">CSS</TabsTrigger>
                                <TabsTrigger value="js">JS</TabsTrigger>
                            </TabsList>

                            {!isDocumentReady ? (
                            <div className="flex-grow flex items-center h-full justify-center">
                                <img src="/loader.gif" />
                            </div>
                            ) : (
                            <TabsContent key={activePanel} value={activePanel} className="h-full">
                                {
                                    activePanel === 'js' && (
                                        <Select onValueChange={setJsType} defaultValue={jsType}>
                                            <SelectTrigger className="p-2 mb-2 w-fit ml-6 text-xs">
                                            <SelectValue placeholder="Js / TS" />
                                            </SelectTrigger>
                                            <SelectContent>
                                            <SelectGroup>
                                                <SelectItem className='text-xs uppercase' value="javascript">JS</SelectItem>
                                                <SelectItem className='text-xs uppercase' value="typescript">TS</SelectItem>
                                            </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )
                                }
                                <Editor
                                    language={activePanel === 'js' ? jsType : activePanel}
                                    value={code[activePanel]}
                                    onChange={handleSetCode}
                                    className="h-full"
                                    theme={theme === 'dark' ? 'vs-dark' : 'vs'}
                                    options={{
                                        // Basic Editor Options
                                        tabSize: 4, // Default tab size
                                        insertSpaces: true, // Insert spaces when pressing Tab
                                        wordWrap: 'on', // Enable word wrapping
                                        autoIndent: 'advanced', // Enable advanced auto-indentation
                                        formatOnType: true, // Automatically format on typing
                                        formatOnPaste: true, // Automatically format on paste

                                        // IntelliSense and Code Assistance
                                        suggestOnTriggerCharacters: true, // Show suggestions when typing trigger characters
                                        acceptSuggestionOnEnter: 'on', // Accept suggestions on Enter
                                        quickSuggestions: { other: true, comments: true, strings: true }, // Enable inline suggestions
                                        quickSuggestionsDelay: 100, // Delay for quick suggestions in ms
                                        parameterHints: {enabled: true},
                                        snippetSuggestions: 'top', // Show snippets at the top of suggestions
                                        autoClosingBrackets: 'always', // Auto-close brackets
                                        autoClosingQuotes: 'always', // Auto-close quotes
                                        autoSurround: 'quotes', // Automatically surround with quotes

                                        // Syntax Highlighting
                                        colorDecorators: true, // Enable color decorators (e.g., for CSS colors)
                                        renderWhitespace: 'boundary', // Show whitespace at boundaries
                                        renderControlCharacters: true, // Show control characters

                                        // User Experience
                                        minimap: { enabled: true }, // Enable minimap
                                        lineNumbers: 'on', // Show line numbers
                                        scrollBeyondLastLine: false, // Disable scrolling beyond the last line
                                        cursorBlinking: 'smooth', // Smooth cursor blinking
                                        cursorStyle: 'line', // Cursor style
                                        cursorWidth: 2, // Width of the cursor
                                        smoothScrolling: true, // Enable smooth scrolling

                                        // Editor Behavior
                                        mouseWheelZoom: true, // Zoom with mouse wheel
                                        matchBrackets: 'always', // Highlight matching brackets
                                        folding: true, // Enable folding
                                        foldingHighlight: true, // Highlight folded regions
                                        foldingStrategy: 'auto', // Automatic folding strategy

                                        // Accessibility
                                        accessibilitySupport: 'on', // Enable accessibility support
                                        renderLineHighlight: 'all', // Highlight the current line
                                        overviewRulerBorder: true, // Show a border around the overview ruler
                                        scrollbar: {
                                            vertical: 'visible',
                                            horizontal: 'visible',
                                            verticalScrollbarSize: 14,
                                            horizontalScrollbarSize: 14,
                                        },
                                    }}
                                />

                            </TabsContent>
                            
                            )}
                        </Tabs>
                    </ResizablePanel>

                    <ResizableHandle/>

                    <ResizablePanel defaultSize={50} className="flex items-center justify-center bg-transparent">
                    <iframe
                        id="output-frame"
                        title="Preview"
                        className="w-full h-full bg-transparent"
                        style={{ backgroundColor: "transparent", border: "none" }}
                        srcDoc={`
                            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    background-color: transparent;
                                    color: inherit;
                                }
                                ${data?.css || ""}
                                </style>
                            </head>
                            <body style="display: flex; align-items: center; justify-content: center;">
                                ${sanitizedHtml || ""}
                                <script>
                                ${data?.js || ""}
                                </script>
                            </body>
                            </html>
                        `}
                        />

                    </ResizablePanel>
                </ResizablePanelGroup> 
            </div>
        </Layout>
    )
}