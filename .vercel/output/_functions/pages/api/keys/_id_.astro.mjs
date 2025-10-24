import { d as db, a as apiKeys } from '../../../chunks/index_D59ZMaGI.mjs';
import { and, eq } from 'drizzle-orm';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const PATCH = async ({ locals, request, params }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Key ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { isActive, credits, rateLimit } = body;
    const updateData = {};
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }
    if (typeof credits === "number") {
      updateData.credits = credits.toString();
    }
    if (typeof rateLimit === "number") {
      updateData.rateLimit = rateLimit;
    }
    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: "No valid fields to update" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const [updatedKey] = await db.update(apiKeys).set(updateData).where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id))).returning({
      id: apiKeys.id,
      label: apiKeys.label,
      keyHash: apiKeys.keyHash,
      isActive: apiKeys.isActive,
      rateLimit: apiKeys.rateLimit,
      credits: apiKeys.credits,
      createdAt: apiKeys.createdAt,
      lastUsedAt: apiKeys.lastUsedAt
    });
    if (!updatedKey) {
      return new Response(JSON.stringify({ error: "API key not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    const response = {
      ...updatedKey,
      keyPreview: updatedKey.keyHash.slice(-4)
    };
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating API key:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async ({ locals, params }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: "Key ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const result = await db.delete(apiKeys).where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id))).returning({ id: apiKeys.id });
    if (result.length === 0) {
      return new Response(JSON.stringify({ error: "API key not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PATCH,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
