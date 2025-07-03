package com.just_for_fun.recipeapp.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.just_for_fun.recipeapp.R

class InstructionsAdapter(private val instructions: List<String>) :
    RecyclerView.Adapter<InstructionsAdapter.InstructionViewHolder>() {

    class InstructionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val stepNumber: TextView = itemView.findViewById(R.id.step_number)
        val instructionText: TextView = itemView.findViewById(R.id.instruction_text)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InstructionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_instruction, parent, false)
        return InstructionViewHolder(view)
    }

    override fun onBindViewHolder(holder: InstructionViewHolder, position: Int) {
        holder.stepNumber.text = (position + 1).toString()
        holder.instructionText.text = instructions[position]
    }

    override fun getItemCount() = instructions.size
}