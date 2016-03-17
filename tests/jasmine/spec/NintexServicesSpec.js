describe("NintexServices", function() {

  var WEBURL = "{InsertTestSiteHere}"; 
  var TESTLIST = "Tasks";
  var TESTWFNAME = "TaskWFSave";
  var TESTLISTID = null;
  var TESTWFID = null;

	$().SPServices({
	 	webURL: WEBURL,
	 	operation: "GetList",
	 	listName: TESTLIST,
	 	async: false,
	 	completefunc: function(xData, Status){
	 		TESTLISTID = $(xData.responseXML).find("List").attr("ID");
	 	}
	 });//End Get List id
  beforeEach(function() {
  	 
  });//end beforeEach
  
  it("should exist", function(){
  	 expect($().NintexServices).toBeDefined();
  });
  
  it("TESTLISTID should not be null", function(){
  	expect(TESTLISTID).not.toBe(null);
  });
  
	it("show work with SaveFromNWF operation", function(){
		$().NintexServices({
			webURL: WEBURL,
			operation: "SaveFromNWF",
			workflowFile: BASE64ENCODEDWF,
			listName: "Tasks",
			workflowName: TESTWFNAME,
			async: false,
		    completefunc: function(xData, Status) {
			expect(Status).toEqual('success');
			TESTWFID = $(xData.responseXML).find("WorkflowId").text();			
			expect(TESTWFID).not.toBe(null);		
		   }
		});    
  });

  //Export Workflow
  it("should work with ExportWorkflow operation", function(){
		$().NintexServices({
			webURL: WEBURL,
			operation: "ExportWorkflow",
			listName: "Tasks",
			workflowType: "list",
			workflowName: TESTWFNAME,
			async: false,
		    completefunc: function(xData, Status) {
			expect(Status).toEqual('success');
		   }
		});
  });

  //Workflow Exists
  it("should work with WorkflowExists operation", function(){
		$().NintexServices({
			webURL: WEBURL,
			operation: "WorkflowExists",
			workflowName: TESTWFNAME,
			listId: TESTWFID,
			workflowType: "list",
			async: false,
		    completefunc: function(xData, Status) {
			expect(Status).toEqual('success');
			expect($(xData.responseXML).find("WorkflowExistsResult").text()).toEqual("NameUsedInOtherList");
		   }
		});
  });

  //Delete Workflow
  it("should work with DeleteWorkflow operation", function(){
		$().NintexServices({
			webURL: WEBURL,
			operation: "DeleteWorkflow",
			listId: TESTLISTID,
			workflowId: TESTWFID,
			workflowType: "list",
			async: false,
		    completefunc: function(xData, Status) {
			expect(Status).toEqual('success');
		   }
		});  	
  });

  //Workflow Exists
  it(TESTWFNAME + " should not exist", function(){
		$().NintexServices({
			webURL: WEBURL,
			operation: "WorkflowExists",
			workflowName: TESTWFNAME,
			listId: TESTWFID,
			workflowType: "list",
			async: false,
		    completefunc: function(xData, Status) {
			expect(Status).toEqual('success');
			expect($(xData.responseXML).find("WorkflowExistsResult").text()).toEqual("NameNotUsed");
		   }
		});
  });
  

});
