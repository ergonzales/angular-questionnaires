import { Component, OnInit, OnChanges } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { FormSection }    from './form-section';
import { FormQuestion }    from './form-question';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	isLinear = true;
	questionnaireObj: any;
	formSections: Array<FormSection> = [];
	totalScore: number = 0;
	pageLanguage: string;
	recommendation: any;
	objectForEmail: Array<any> = []; // title, array containing both questions and possible answers, and array of given answers?


	constructor(private _formBuilder: FormBuilder) {}

	ngOnInit() {

		this.pageLanguage = window["questionnaireLang"] ? window["questionnaireLang"] : "EN";

		this.questionnaireObj = window["questionnaireData"];

		this.questionnaireObj.sections.forEach((section)=>{
			let t = section.title;
			let n = section.title[this.pageLanguage].replace(/\s/g, ""); //name			
			let fgroup = {};

			let formSection = new FormSection(n, t,section.isComplete, [], null);
			section.questions.forEach((question)=>{
				let formQuestion = new FormQuestion(
					question.id, question.question, question.answers
				);
				fgroup[question.id] = new FormControl('',Validators.required);
				formSection.questions.push(formQuestion);
			});
			formSection.formGroup = new FormGroup(fgroup);
			this.formSections.push(formSection);
		});
		this.onFormChanges();
	}  

	private onFormChanges(){
		this.formSections.forEach((section)=>{
			Object.keys(section.formGroup.controls).forEach((key)=>{
				section.formGroup.get(key).valueChanges.subscribe(value => {
					this.calculateTotalScore();
				});
      });
			section.formGroup.statusChanges.subscribe((status)=>{
				section.isComplete = status == "INVALID" ? false : true;				
			});			
		});
	}

	private calculateTotalScore(){
		//obv calculate score but we also build the object to send along in the email
		this.totalScore = 0;
		this.objectForEmail = []; // title, array containing both questions and possible answers, and array of given answers?
		this.objectForEmail['language'] = this.pageLanguage;

		this.formSections.forEach((section)=>{
			var emailSection = {};
			emailSection['name'] = section.name;
			emailSection['questionsAndAnswers'] = section.questions;
			emailSection['userResponses'] = [];
			Object.keys(section.formGroup.controls).forEach((key)=>{
				this.totalScore += section.formGroup.get(key).value;
				var userResponse = {};
				userResponse['question'] = key;
				userResponse['response'] = section.formGroup.get(key).value;;
				emailSection['userResponses'].push(userResponse);				
			});
			this.objectForEmail.push(emailSection);
		});
		
		//set recommendation
		this.questionnaireObj.results.forEach((r)=>{
			if (this.totalScore >= r.targetScoreMin && this.totalScore <= r.targetScoreMax){
				this.recommendation = r;
			}
    });
		console.log(this.objectForEmail);		
		console.log(this.formSections);
		(document.getElementById('emailObject') as any).innerHTML=JSON.stringify(this.objectForEmail);
	}

}
