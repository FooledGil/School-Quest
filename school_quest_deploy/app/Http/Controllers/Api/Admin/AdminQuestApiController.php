<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use Illuminate\Http\Request;

class AdminQuestApiController extends Controller
{
    public function index()
    {
        $quests = Quest::where('type', 'additional')->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $quests,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'exp_reward' => 'required|integer|min:1',
            'difficulty' => 'required|in:easy,medium,hard',
            'is_active' => 'boolean',
        ]);

        $data['type'] = 'additional';
        $data['created_by'] = $request->user()->id;

        $quest = Quest::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Quest berhasil ditambahkan!',
            'data' => $quest,
        ]);
    }

    public function update(Request $request, Quest $quest)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'exp_reward' => 'required|integer|min:1',
            'difficulty' => 'required|in:easy,medium,hard',
            'is_active' => 'boolean',
        ]);

        $quest->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Quest berhasil diperbarui!',
            'data' => $quest,
        ]);
    }

    public function destroy(Quest $quest)
    {
        $quest->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Quest berhasil dihapus!',
        ]);
    }
}
