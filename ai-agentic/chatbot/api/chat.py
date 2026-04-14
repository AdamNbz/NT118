from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from llm.rag import RAGPipeline
from vectorstore.create import get_vector_store
import config.setting as config

router = APIRouter(prefix="/api/chat", tags=["chat"])

ECOMMERCE_SYSTEM_PROMPT = """Ban la "ShopAI" - tro ly tu van thuong mai dien tu cua ShopeeLite.
Tra loi bang tieng Viet, than thien va tu nhien nhu dang nhan tin.
TUYET DOI KHONG dung markdown, emoji, icon, dau gach dau dong hay so thu tu.
Ho tro khach hang ve: tim kiem san pham, dat hang, thanh toan, van chuyen, tra hang, voucher, tai khoan.
Neu khong chac chan, huong dan khach lien he hotline ho tro."""


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[ChatMessage]] = []
    use_rag: bool = True
    top_k: Optional[int] = None


class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = None
    num_sources: Optional[int] = None


_rag_pipeline = None


def get_rag_pipeline():
    global _rag_pipeline

    if _rag_pipeline is None:
        vector_store = get_vector_store()
        _rag_pipeline = RAGPipeline(vector_store, config.MODEL_TYPE)

    return _rag_pipeline


@router.post("", response_model=ChatResponse)
@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    import traceback
    try:
        history = []
        if request.conversation_history:
            for msg in request.conversation_history:
                history.append({
                    "role": msg.role,
                    "content": msg.content
                })

        if request.use_rag:
            try:
                rag_pipeline = get_rag_pipeline()
                result = rag_pipeline.query(
                    query=request.message,
                    conversation_history=history,
                    top_k=request.top_k
                )
                return ChatResponse(
                    answer=result["answer"],
                    sources=result.get("sources"),
                    num_sources=result.get("num_sources", 0)
                )
            except Exception as e:
                print(f"RAG failed, falling back to direct LLM: {e}")

        from llm.client import get_llm_client
        try:
            llm_client = get_llm_client(config.MODEL_TYPE)
            answer = llm_client.chat(
                user_message=request.message,
                conversation_history=history,
                system_prompt=ECOMMERCE_SYSTEM_PROMPT
            )
        except ValueError as e:
            error_detail = str(e)
            print(f"ValueError in chat: {error_detail}")
            return ChatResponse(
                answer="Xin loi ban, ShopAI tam thoi khong the ket noi. Vui long thu lai sau it phut nhe!",
                sources=None,
                num_sources=0
            )
        except ImportError as e:
            error_detail = str(e)
            print(f"ImportError in chat: {error_detail}")
            return ChatResponse(
                answer="He thong dang bao tri, ShopAI se quay lai som. Ban co the lien he hotline 1900-xxxx de duoc ho tro ngay!",
                sources=None,
                num_sources=0
            )
        except Exception as e:
            error_detail = str(e)
            traceback.print_exc()
            print(f"LLM error: {error_detail}")
            return ChatResponse(
                answer="Xin loi ban, ShopAI dang gap su co ky thuat. Vui long thu lai sau hoac lien he bo phan ho tro qua hotline 1900-xxxx nhe!",
                sources=None,
                num_sources=0
            )

        return ChatResponse(
            answer=answer,
            sources=None,
            num_sources=0
        )

    except HTTPException:
        raise
    except Exception as e:
        error_detail = str(e)
        traceback.print_exc()
        print(f"Unexpected error in chat endpoint: {error_detail}")
        return ChatResponse(
            answer="ShopAI xin loi vi su bat tien. He thong dang duoc khac phuc. Ban vui long thu lai sau nhe!",
            sources=None,
            num_sources=0
        )


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    try:
        rag_pipeline = get_rag_pipeline()

        history = []
        if request.conversation_history:
            for msg in request.conversation_history:
                history.append({
                    "role": msg.role,
                    "content": msg.content
                })

        if request.use_rag:
            from fastapi.responses import StreamingResponse
            import json

            def generate():
                for chunk in rag_pipeline.stream_query(
                    query=request.message,
                    conversation_history=history,
                    top_k=request.top_k
                ):
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"

            return StreamingResponse(generate(), media_type="text/event-stream")
        else:
            from fastapi.responses import StreamingResponse
            from llm.client import get_llm_client
            import json

            llm_client = get_llm_client(config.MODEL_TYPE)

            def generate():
                for chunk in llm_client.stream_chat(
                    user_message=request.message,
                    conversation_history=history,
                    system_prompt=ECOMMERCE_SYSTEM_PROMPT
                ):
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"

            return StreamingResponse(generate(), media_type="text/event-stream")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
