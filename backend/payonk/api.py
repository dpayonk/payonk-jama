import uvicorn
from fastapi import FastAPI, Response, HTTPException, Form, Request
from fastapi.staticfiles import StaticFiles  # for my static front end
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

# These URLs will transform JSON APIs to Python Style
# from emailAddress to email_address
app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=[],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def root_url(request: Request, email=""):
    """ Default Response from Web
        request_path = request_promise.url.path
    """
    return render_html('index.html', {"request": request, "id": id})


@app.get('/health')
async def ping_url(request: Request):
    """
    Get status of all configurations
    """
    return {'status': 'health'}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
