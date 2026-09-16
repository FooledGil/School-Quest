<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminQuestController extends Controller
{
    public function index()
    {
        $quests = Quest::where('type', 'additional')->latest()->get();
        return Inertia::render('Admin/Quests/Index', [
            'quests' => $quests
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Quests/Create');
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
        $data['created_by'] = Auth::id();

        Quest::create($data);

        return redirect()->route('admin.quests.index')->with('success', 'Quest berhasil ditambahkan');
    }

    public function edit(Quest $quest)
    {
        return Inertia::render('Admin/Quests/Edit', [
            'quest' => $quest
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

        return redirect()->route('admin.quests.index')->with('success', 'Quest berhasil diupdate');
    }

    public function destroy(Quest $quest)
    {
        $quest->delete();
        return redirect()->route('admin.quests.index')->with('success', 'Quest berhasil dihapus');
    }
}
